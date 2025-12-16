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
		shareId: null,
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

const addPostBackground = async (data: LocalPost) => {
	await db.posts.add(data);
};

export default defineBackground({
	type: "module",
	main() {
		onMessage("DB_SAVE_HIGHLIGHT", async (message) => {
			const { data, postId } = message.data;
			await addHightLightBackground({ data, postId });
			return { success: true };
		});

		onMessage("DB_DELETE_HIGHLIGHT", async (message) => {
			const { id } = message.data;
			await deleteHighlightBackground(id);
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

		onMessage("DB_ADD_POST", async (message) => {
			const { postData } = message.data;
			await addPostBackground(postData);
			return { success: true };
		});
	},
});
