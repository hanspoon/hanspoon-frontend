import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "@/lib/highlight/types";

export const saveHighlight = async ({
	data,
	postId,
}: {
	data: SerializedHighlight;
	postId: string;
}) => {
	const response = await sendMessage("DB_SAVE_HIGHLIGHT", { data, postId });

	if (!response?.success) {
		throw new Error(`DB Error: Highlight save failed`);
	}

	return { postId };
};

export const deleteHighlight = async (id: string) => {
	const response = await sendMessage("DB_DELETE_HIGHLIGHT", { id });
	if (!response?.success) {
		throw new Error(`DB Error: Highlight delete failed`);
	}
};

export const getAllHighlights = async (): Promise<
	LocalAnnotation[] | undefined
> => {
	const highlights = await sendMessage("DB_GET_ALL_HIGHLIGHTS", undefined);
	return highlights;
};

export const getAllHighlightsByPostId = async (
	id: string,
): Promise<LocalAnnotation[]> => {
	const highlights = await sendMessage("DB_GET_ALL_HIGHLIGHTS_BY_ID", {
		postId: id,
	});
	return highlights;
};

export const updateHighlightsByPostId = async (
	postId: string,
	updates: Partial<LocalAnnotation>,
) => {
	const response = await sendMessage("DB_UPDATE_ANNOTATIONS_BY_POST_ID", {
		postId,
		updates,
	});
	if (!response?.success) {
		throw new Error(`DB Error: Annotation update failed`);
	}
};

export const getAllPosts = async (): Promise<LocalPost[] | undefined> => {
	const allPosts = await sendMessage("DB_GET_ALL_POSTS", undefined);
	return allPosts;
};

export const getPostById = async (
	id: string,
): Promise<LocalPost | undefined> => {
	const post = await sendMessage("DB_GET_POST_BY_ID", { postId: id });
	return post;
};

export const getPostByUrl = async (
	url: string,
): Promise<LocalPost | undefined> => {
	const post = await sendMessage("DB_GET_POST_BY_URL", { url });
	return post;
};

export const addPost = async (data: LocalPost) => {
	const response = await sendMessage("DB_ADD_POST", { postData: data });
	if (!response?.success) {
		throw new Error(`DB Error: Post add failed`);
	}

	return data;
};

export const updatePost = async (
	postId: string,
	updates: Partial<LocalPost>,
) => {
	const response = await sendMessage("DB_UPDATE_POST", { postId, updates });
	if (!response?.success) {
		throw new Error(`DB Error: Post update failed`);
	}
};

export const deletePost = async (postId: string) => {
	const response = await sendMessage("DB_DELETE_POST", { postId });
	if (!response?.success) {
		throw new Error(`DB Error: Post delete failed`);
	}
};

export const deleteAnnotationsByPostId = async (postId: string) => {
	const response = await sendMessage("DB_DELETE_ANNOTATIONS_BY_POST_ID", {
		postId,
	});
	if (!response?.success) {
		throw new Error(`DB Error: Annotations delete failed`);
	}
};
