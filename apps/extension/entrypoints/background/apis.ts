import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "@/lib/highlight/types";
import { db } from "../../models/db";

export const getHighlightByIdBackground = async (id: string) => {
	return await db.annotations.get(id);
};

// 하이라이트
export const createHightLightBackground = async ({
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

export const updateAllHighlightsByPostIdBackground = ({
	postId,
	updates,
}: {
	postId: string;
	updates: Partial<LocalAnnotation>;
}) => {
	return db.annotations.upsert(postId, updates);
};

export const getAllHighlightsBackground = () => {
	return db.annotations.toArray();
};

export const getAllHighlightsByPostIdBackground = (postId: string) => {
	return db.annotations.where("postId").equals(postId).toArray();
};

export const deleteHighlightBackground = async (id: string) => {
	await db.annotations.delete(id);
};

export const deleteAllHighlightsByPostIdBackground = async (postId: string) => {
	await db.annotations.where("postId").equals(postId).delete();
};

// 포스트
export const createPostBackground = async (data: LocalPost) => {
	await db.posts.add(data);
};

export const updatePostBackground = async ({
	postId,
	updates,
}: {
	postId: string;
	updates: Partial<LocalPost>;
}) => {
	await db.posts.update(postId, updates);
};

export const getPostByIdBackground = async (id: string) => {
	return await db.posts.get(id);
};

export const getPostByUrlBackground = async (url: string) => {
	return await db.posts.where("url").equals(url).first();
};

export const getAllPostsBackground = async () => {
	return await db.posts.toArray();
};

export const deletePostBackground = async (postId: string) => {
	await db.posts.delete(postId);
};
