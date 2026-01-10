import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "../lib/highlight/types";
import { db } from "../models/db";
import { onMessage } from "../utils/message";

const addHightLightBackground = async ({
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

const deleteHighlightBackground = async (id: string) => {
	await db.annotations.delete(id);
};

const getAllHighlightsBackground = () => {
	return db.annotations.toArray();
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

const addPostBackground = async (data: LocalPost) => {
	await db.posts.add(data);
};

const broadcastToAllTabs = async (
	message: {
		type: string;
		data: { highlightId: string; postId?: string; timestamp?: number };
	},
	excludeTabId?: number,
) => {
	const tabs = await browser.tabs.query({});

	tabs.forEach((tab) => {
		if (tab.id && tab.id !== excludeTabId) {
			browser.tabs.sendMessage(tab.id, message).catch(() => {});
		}
	});
};

export default defineBackground({
	type: "module",
	main() {
		onMessage("DB_SAVE_HIGHLIGHT", async (message) => {
			const { data, postId } = message.data;
			await addHightLightBackground({ data, postId });

			await broadcastToAllTabs(
				{
					type: "HIGHLIGHT_ADDED",
					data: {
						highlightId: data.id,
						postId,
						timestamp: performance.timeOrigin + performance.now(),
					},
				},
				message.sender.tab?.id,
			);

			return { success: true };
		});

		onMessage("DB_DELETE_HIGHLIGHT", async (message) => {
			const { id } = message.data;
			await deleteHighlightBackground(id);

			await broadcastToAllTabs(
				{
					type: "HIGHLIGHT_DELETED",
					data: {
						highlightId: id,
						timestamp: performance.timeOrigin + performance.now(),
					},
				},
				message.sender.tab?.id,
			);

			return { success: true };
		});

		onMessage("DB_GET_ALL_HIGHLIGHTS", async () => {
			const highlights = await getAllHighlightsBackground();
			return highlights;
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

		onMessage("DB_ADD_POST", async (message) => {
			const { postData } = message.data;
			await addPostBackground(postData);
			return { success: true };
		});

		browser.runtime.onMessageExternal.addListener(
			(message, sender, sendResponse) => {
				if (message.type === "LOGIN_SUCCESS") {
					const session = message.payload;

					browser.storage.local.set({ session }, () => {
						console.log("로그인 정보 저장 완료!");
						sendResponse({ success: true });
					});

					if (sender.tab?.id) {
						browser.tabs.remove(sender.tab.id);
					}

					return true;
				}
			},
		);
	},
});
