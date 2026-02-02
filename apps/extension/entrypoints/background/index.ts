import type { Session } from "@supabase/supabase-js";
import { storage } from "@/apis/browser-storage";
import { initSupabaseSession, supabase } from "@/lib/supabase/supabase";

import { onMessage } from "../../utils/message";
import * as apis from "./apis";

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

// 로그인
const saveLoginSessionBackground = async (session: Session) => {
	await storage.set("session", session);
	return { success: true };
};

export default defineBackground({
	type: "module",
	async main() {
		await initSupabaseSession();

		// 하이라이트
		onMessage("DB_CREATE_HIGHLIGHT", async (message) => {
			try {
				const { data: highlight, postId } = message.data;
				await apis.createHightLightBackground({ data: highlight, postId });

				broadcastToAll({
					type: "HIGHLIGHT_CREATED",
					id: highlight.id,
					postId,
					timestamp: performance.timeOrigin + performance.now(),
				});
				const post = await apis.getPostByIdBackground(postId);

				if (post?.isPublished) {
					const session = await storage.get<Session>("session");

					if (!session) {
						return { success: false };
					}

					await supabase
						.from("annotations")
						.insert({
							id: highlight.id,
							post_id: post.id,
							start_meta: highlight.start,
							end_meta: highlight.end,
							text: highlight.text,
							user_id: session.user.id,
							share_id: post.shareId,
							updated_at: new Date().toISOString(),
						})
						.throwOnError();
				}
				return { success: true };
			} catch (error) {
				console.error("message: DB_CREATE_HIGHLIGHT failed", error);
				return { success: false };
			}
		});

		onMessage("DB_UPDATE_ALL_HIGHLIGHTS_BY_POST_ID", async (message) => {
			const { postId, updates } = message.data;
			try {
				await apis.updateAllHighlightsByPostIdBackground({ postId, updates });
				return { success: true };
			} catch (error) {
				console.error(
					"message: DB_UPDATE_ALL_HIGHLIGHTS_BY_POST_ID failed",
					error,
				);
				return { success: false };
			}
		});

		onMessage("DB_GET_ALL_HIGHLIGHTS", async () => {
			const highlights = await apis.getAllHighlightsBackground();
			return highlights;
		});

		onMessage("DB_GET_ALL_HIGHLIGHTS_BY_ID", async (message) => {
			const { postId } = message.data;
			const highlights = await apis.getAllHighlightsByPostIdBackground(postId);
			return highlights;
		});

		onMessage("DB_DELETE_HIGHLIGHT", async (message) => {
			try {
				const { id } = message.data;

				const highlight = await apis.getHighlightByIdBackground(id);

				if (!highlight) {
					return { success: false };
				}

				await apis.deleteHighlightBackground(id);

				broadcastToAll({
					type: "HIGHLIGHT_DELETED",
					id,
					timestamp: performance.timeOrigin + performance.now(),
				});

				const post = await apis.getPostByIdBackground(highlight.postId);
				if (post?.isPublished) {
					await supabase
						.from("annotations")
						.delete()
						.eq("id", id)
						.throwOnError();
				}

				return { success: true };
			} catch (error) {
				console.error("message: DB_DELETE_HIGHLIGHT failed", error);
				return { success: false };
			}
		});

		onMessage("DB_DELETE_ALL_HIGHLIGHTS_BY_POST_ID", async (message) => {
			const { postId } = message.data;
			await apis.deleteAllHighlightsByPostIdBackground(postId);

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
			await apis.createPostBackground(postData);

			broadcastToAll({
				type: "POST_CREATED",
				postId: postData.id,
				timestamp: performance.timeOrigin + performance.now(),
			});

			return { success: true };
		});

		onMessage("DB_UPDATE_POST", async (message) => {
			const { postId, updates } = message.data;
			await apis.updatePostBackground({ postId, updates });
			return { success: true };
		});

		onMessage("DB_GET_POST_BY_ID", async (message) => {
			const { postId } = message.data;
			const post = await apis.getPostByIdBackground(postId);
			return post;
		});

		onMessage("DB_GET_POST_BY_URL", async (message) => {
			const { url } = message.data;
			const post = await apis.getPostByUrlBackground(url);
			return post;
		});

		onMessage("DB_GET_ALL_POSTS", async () => {
			const posts = await apis.getAllPostsBackground();
			return posts;
		});

		onMessage("DB_DELETE_POST", async (message) => {
			const { postId } = message.data;
			await apis.deletePostBackground(postId);

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
