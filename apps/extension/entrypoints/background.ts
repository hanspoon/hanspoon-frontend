import type { Session } from "@supabase/supabase-js";
import { initSupabaseSession, supabase } from "@/lib/supabase/supabase";
import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "../lib/highlight/types";
import { db } from "../models/db";
import { onMessage } from "../utils/message";

export type HighlightSyncMessage =
	| {
			type: "HIGHLIGHT_CREATED";
			id: string;
			postId: string;
			timestamp: number;
	  }
	| { type: "HIGHLIGHT_DELETED"; id: string; timestamp: number }
	| { type: "POST_CREATED"; postId: string; timestamp: number }
	| { type: "POST_DELETED"; postId: string; timestamp: number }
	| { type: "All_HIGHLIGHTS_DELETED"; postId: string; timestamp: number };

const broadcastToAll = (message: HighlightSyncMessage) => {
	browser.tabs.query({}, (tabs) => {
		for (const tab of tabs) {
			if (tab.id) {
				browser.tabs
					.sendMessage(tab.id, message)
					.then(() => {
						console.log(`✅ Message sent to tab ${tab.id}:`, message.type);
					})
					.catch((error) => {
						console.log(`❌ Failed to send to tab ${tab.id}:`, error.message);
					});
			}
		}
	});

	browser.runtime.sendMessage(message).catch(() => {
		console.warn(`Failed to broadcastToAll`);
	});
};

// 하이라이트
const createHightLightBackground = async ({
	data,
	postId,
}: {
	data: SerializedHighlight;
	postId: string;
}) => {
	const annotation: LocalAnnotation = {
		...data,
		postId: postId,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		shareId: crypto.randomUUID(),
		isSynced: false,
	};

	await db.annotations.add(annotation);
};

const updateAllHighlightsByPostIdBackground = ({
	postId,
	updates,
}: {
	postId: string;
	updates: Partial<LocalAnnotation>;
}) => {
	return db.annotations.upsert(postId, updates);
};

const getAllHighlightsBackground = () => {
	return db.annotations.toArray();
};

const getAllHighlightsByPostIdBackground = (postId: string) => {
	return db.annotations.where("postId").equals(postId).toArray();
};

const deleteHighlightBackground = async (id: string) => {
	await db.annotations.delete(id);
};

const deleteAllHighlightsByPostIdBackground = async (postId: string) => {
	await db.annotations.where("postId").equals(postId).delete();
};

// 포스트
const createPostBackground = async (data: LocalPost) => {
	await db.posts.add(data);
};

const updatePostBackground = async ({
	postId,
	updates,
}: {
	postId: string;
	updates: Partial<LocalPost>;
}) => {
	await db.posts.update(postId, updates);
};

const getPostByIdBackground = async (id: string) => {
	return await db.posts.get(id);
};

const getPostByUrlBackground = async (url: string) => {
	return await db.posts.where("url").equals(url).first();
};

const getAllPostsBackground = async () => {
	return await db.posts.toArray();
};

const deletePostBackground = async (postId: string) => {
	await db.posts.delete(postId);
};

// 로그인
const saveLoginSessionBackground = async (session: unknown) => {
	return new Promise<{ success: boolean }>((resolve) => {
		browser.storage.local.set({ session }, () => {
			resolve({ success: true });
		});
	});
};

export default defineBackground({
	type: "module",
	async main() {
		await initSupabaseSession();

		// 하이라이트
		onMessage("DB_CREATE_HIGHLIGHT", async (message) => {
			try {
				const { data: highlight, postId } = message.data;
				await createHightLightBackground({ data: highlight, postId });

				broadcastToAll({
					type: "HIGHLIGHT_CREATED",
					id: highlight.id,
					postId,
					timestamp: performance.timeOrigin + performance.now(),
				});

				const post = await db.posts.get(postId);

				if (post?.isPublished) {
					const { session } = await browser.storage.local.get<{
						session: Session;
					}>("session");

					const { error } = await supabase.from("annotations").insert({
						id: highlight.id,
						post_id: post.id,
						start_meta: highlight.start,
						end_meta: highlight.end,
						text: highlight.text,
						user_id: session.user.id,
						share_id: post.shareId,
						updated_at: new Date().toISOString(),
					});

					if (error) {
						throw error;
					}

					// await syncPostToSupabase(post.id, session);
				}
				return { success: true };
			} catch (error) {
				console.error("message: DB_CREATE_HIGHLIGHT failed", error);
				return { success: false };
			}
		});

		onMessage("DB_UPDATE_ALL_HIGHLIGHTS_BY_POST_ID", async (message) => {
			const { postId, updates } = message.data;
			await updateAllHighlightsByPostIdBackground({ postId, updates });
			return { success: true };
		});

		onMessage("DB_GET_ALL_HIGHLIGHTS", async () => {
			const highlights = await getAllHighlightsBackground();
			return highlights;
		});

		onMessage("DB_GET_ALL_HIGHLIGHTS_BY_ID", async (message) => {
			const { postId } = message.data;
			const highlights = await getAllHighlightsByPostIdBackground(postId);
			return highlights;
		});

		onMessage("DB_DELETE_HIGHLIGHT", async (message) => {
			try {
				const { id } = message.data;

				const annotation = await db.annotations.get(id);

				await deleteHighlightBackground(id);

				broadcastToAll({
					type: "HIGHLIGHT_DELETED",
					id,
					timestamp: performance.timeOrigin + performance.now(),
				});

				if (annotation) {
					const post = await db.posts.get(annotation.postId);
					if (post?.isPublished) {
						const { error } = await supabase
							.from("annotations")
							.delete()
							.eq("id", id);
						if (error) {
							console.error("message: DB_DELETE_HIGHLIGHT failed", error);
							return { success: false };
						}
					}
				}

				return { success: true };
			} catch (error) {
				console.error("message: DB_DELETE_HIGHLIGHT failed", error);
				return { success: false };
			}
		});

		onMessage("DB_DELETE_ALL_HIGHLIGHTS_BY_POST_ID", async (message) => {
			const { postId } = message.data;
			await deleteAllHighlightsByPostIdBackground(postId);

			broadcastToAll({
				type: "All_HIGHLIGHTS_DELETED",
				postId,
				timestamp: performance.timeOrigin + performance.now(),
			});

			return { success: true };
		});

		// 포스트
		onMessage("DB_CREATE_POST", async (message) => {
			const { postData } = message.data;
			await createPostBackground(postData);

			broadcastToAll({
				type: "POST_CREATED",
				postId: postData.id,
				timestamp: performance.timeOrigin + performance.now(),
			});

			return { success: true };
		});

		onMessage("DB_UPDATE_POST", async (message) => {
			const { postId, updates } = message.data;
			await updatePostBackground({ postId, updates });
			return { success: true };
		});

		onMessage("DB_GET_POST_BY_ID", async (message) => {
			const { postId } = message.data;
			const post = await getPostByIdBackground(postId);
			return post;
		});

		onMessage("DB_GET_POST_BY_URL", async (message) => {
			const { url } = message.data;
			const post = await getPostByUrlBackground(url);
			return post;
		});

		onMessage("DB_GET_ALL_POSTS", async () => {
			const posts = await getAllPostsBackground();
			return posts;
		});

		onMessage("DB_DELETE_POST", async (message) => {
			const { postId } = message.data;
			await deletePostBackground(postId);

			broadcastToAll({
				type: "POST_DELETED",
				postId,
				timestamp: performance.timeOrigin + performance.now(),
			});

			return { success: true };
		});

		// 로그인
		onMessage("LOGIN_SUCCESS", async (message) => {
			const { session } = message.data;
			const result = await saveLoginSessionBackground(session);
			return result;
		});

		browser.runtime.onMessageExternal.addListener(
			async (message, sender, sendResponse) => {
				if (message.type === "LOGIN_SUCCESS") {
					const session = message.payload;
					const result = await saveLoginSessionBackground(session);
					sendResponse(result);

					if (sender.tab?.id) {
						browser.tabs.remove(sender.tab.id);
					}

					return true;
				}
			},
		);
	},
});
