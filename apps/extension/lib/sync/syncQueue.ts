import type { Session } from "@supabase/supabase-js";
import type { SyncQueueItem } from "@/lib/highlight/types";
import { db } from "@/models/db";
import { supabase } from "../supabase/supabas";

class SyncQueueService {
	private isProcessing = false;
	private readonly MAX_RETRIES = 3;
	private readonly RETRY_DELAY = 5000;
	private readonly DEBOUNCE_DELAY = 300;

	async enqueue(postId: string, action: "upsert" | "delete") {
		const existing = await db.syncQueue
			.where({ postId, status: "pending" })
			.first();

		if (existing) {
			await db.syncQueue.update(existing.id, {
				action,
				createdAt: Date.now(),
			});
			this.processQueue();
			return;
		}

		await db.syncQueue.add({
			id: crypto.randomUUID(),
			postId,
			action,
			status: "pending",
			retryCount: 0,
			createdAt: Date.now(),
		});

		this.processQueue();
	}

	private async processQueue() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		await this.delay(this.DEBOUNCE_DELAY);

		try {
			while (true) {
				const item = await db.syncQueue
					.where("status")
					.equals("pending")
					.first();

				if (!item) break;

				await this.processItem(item);
			}
		} finally {
			this.isProcessing = false;
		}
	}

	private async processItem(item: SyncQueueItem) {
		await db.syncQueue.update(item.id, {
			status: "processing",
			lastAttempt: Date.now(),
		});

		try {
			const session = await this.getSession();
			if (!session) {
				console.log("[SyncQueue] No session, skipping sync");
				await db.syncQueue.update(item.id, { status: "pending" });
				return;
			}

			if (item.action === "upsert") {
				await this.upsertToSupabase(item.postId, session);
			} else if (item.action === "delete") {
				await this.deleteFromSupabase(item.postId, session);
			}

			await db.syncQueue.delete(item.id);
			console.log(`[SyncQueue] Successfully synced post ${item.postId}`);
		} catch (error) {
			await this.handleError(item, error);
		}
	}

	private async upsertToSupabase(postId: string, session: Session) {
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: session.access_token,
			refresh_token: session.refresh_token,
		});

		if (sessionError) {
			throw new Error(`Session error: ${sessionError.message}`);
		}

		const post = await db.posts.get(postId);
		if (!post) {
			throw new Error(`Post not found: ${postId}`);
		}

		const { error: postError } = await supabase.from("posts").upsert({
			id: post.id,
			url: post.url,
			title: post.title,
			user_id: session.user.id,
			share_id: post.shareId,
			updated_at: new Date().toISOString(),
		});

		if (postError) {
			throw postError;
		}

		const highlights = await db.annotations
			.where("postId")
			.equals(postId)
			.toArray();

		if (highlights.length > 0) {
			const annotationsToUpload = highlights.map((ann) => ({
				id: ann.id,
				post_id: post.id,
				start_meta: ann.start,
				end_meta: ann.end,
				text: ann.text,
				user_id: session.user.id,
				share_id: post.shareId,
				updated_at: new Date().toISOString(),
			}));

			const { error: annError } = await supabase
				.from("annotations")
				.upsert(annotationsToUpload);

			if (annError) {
				throw annError;
			}
		}

		await db.annotations.where("postId").equals(postId).modify({
			isSynced: true,
			updatedAt: Date.now(),
		});

		await db.posts.update(postId, {
			isSynced: true,
			updatedAt: Date.now(),
		});
	}

	private async deleteFromSupabase(postId: string, session: Session) {
		const { error: sessionError } = await supabase.auth.setSession({
			access_token: session.access_token,
			refresh_token: session.refresh_token,
		});

		if (sessionError) {
			throw new Error(`Session error: ${sessionError.message}`);
		}

		const { error: annError } = await supabase
			.from("annotations")
			.delete()
			.eq("post_id", postId);

		if (annError) {
			throw annError;
		}

		const { error: postError } = await supabase
			.from("posts")
			.delete()
			.eq("id", postId);

		if (postError) {
			throw postError;
		}

		await db.posts.update(postId, {
			isSynced: false,
		});

		console.log(`[SyncQueue] Deleted post ${postId} from Supabase`);
	}

	private async handleError(item: SyncQueueItem, error: unknown) {
		const newRetryCount = item.retryCount + 1;
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		console.error(
			`[SyncQueue] Error syncing post ${item.postId}:`,
			errorMessage,
		);

		if (newRetryCount >= this.MAX_RETRIES) {
			await db.syncQueue.update(item.id, {
				status: "failed",
				retryCount: newRetryCount,
				error: errorMessage,
			});
			console.error(`[SyncQueue] Max retries reached for post ${item.postId}`);
		} else {
			await db.syncQueue.update(item.id, {
				status: "pending",
				retryCount: newRetryCount,
				error: errorMessage,
			});

			setTimeout(() => {
				this.processQueue();
			}, this.RETRY_DELAY * newRetryCount);
		}
	}

	private async getSession(): Promise<Session | null> {
		return new Promise((resolve) => {
			browser.storage.local.get("session", (result) => {
				resolve(result.session || null);
			});
		});
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async retryFailed() {
		const failedCount = await db.syncQueue
			.where("status")
			.equals("failed")
			.modify({ status: "pending", retryCount: 0 });

		if (failedCount > 0) {
			console.log(`[SyncQueue] Retrying ${failedCount} failed items`);
			this.processQueue();
		}
	}

	async getPendingCount(): Promise<number> {
		return db.syncQueue.where("status").equals("pending").count();
	}

	async getFailedItems(): Promise<SyncQueueItem[]> {
		return db.syncQueue.where("status").equals("failed").toArray();
	}
}

export const syncQueue = new SyncQueueService();
