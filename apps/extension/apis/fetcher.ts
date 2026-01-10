import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "@/lib/highlight/types";
import { notifyHighlightChange } from "@/lib/metrics/syncMetrics";
import { db } from "@/models/db";

export const saveHighlight = async ({
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

	await notifyHighlightChange({
		id: data.id,
		postId,
		action: "HIGHLIGHT_ADDED",
	});

	return { postId };
};

export const deleteHighlight = async (id: string) => {
	const annotation = await db.annotations.get(id);
	if (!annotation) {
		throw new Error(`DB Error: Highlight not found`);
	}

	await db.annotations.delete(id);

	await notifyHighlightChange({
		id,
		postId: annotation.postId,
		action: "HIGHLIGHT_DELETED",
	});
};

export const getAllHighlights = async (): Promise<
	LocalAnnotation[] | undefined
> => {
	return await db.annotations.toArray();
};

export const getAllPosts = async (): Promise<LocalPost[] | undefined> => {
	return await db.posts.toArray();
};

export const getPostById = async (
	id: string,
): Promise<LocalPost | undefined> => {
	return await db.posts.get(id);
};

export const getPostByUrl = async (
	url: string,
): Promise<LocalPost | undefined> => {
	return await db.posts.where("url").equals(url).first();
};

export const addPost = async (data: LocalPost) => {
	await db.posts.add(data);
	return data;
};
