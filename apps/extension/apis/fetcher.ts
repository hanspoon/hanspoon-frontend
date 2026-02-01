import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "@/lib/highlight/types";

// 하이라이트
export const createHighlight = async ({
	data,
	postId,
}: {
	data: SerializedHighlight;
	postId: string;
}) => {
	const response = await sendMessage("DB_CREATE_HIGHLIGHT", { data, postId });

	if (!response?.success) {
		throw new Error(`[HighlightService] Failed to create: DB_CREATE_HIGHLIGHT`);
	}

	return { postId };
};

export const updateAllHighlightsByPostId = async ({
	postId,
	updates,
}: {
	postId: string;
	updates: Partial<LocalAnnotation>;
}) => {
	const response = await sendMessage("DB_UPDATE_ALL_HIGHLIGHTS_BY_POST_ID", {
		postId,
		updates,
	});

	if (!response?.success) {
		throw new Error(
			`[HighlightService] Failed to update: DB_UPDATE_ALL_HIGHLIGHTS_BY_POST_ID`,
		);
	}
};

export const getAllHighlights = async (): Promise<LocalAnnotation[]> => {
	const highlights = await sendMessage("DB_GET_ALL_HIGHLIGHTS", undefined);

	if (highlights === undefined) {
		throw new Error(`[HighlightService] Failed to read: DB_GET_ALL_HIGHLIGHTS`);
	}

	return highlights;
};

export const getAllHighlightsByPostId = async (
	id: string,
): Promise<LocalAnnotation[]> => {
	const highlights = await sendMessage("DB_GET_ALL_HIGHLIGHTS_BY_ID", {
		postId: id,
	});

	if (highlights === undefined) {
		throw new Error(
			`[HighlightService] Failed to read: DB_GET_ALL_HIGHLIGHTS_BY_ID`,
		);
	}

	return highlights;
};

export const deleteHighlight = async (id: string) => {
	const response = await sendMessage("DB_DELETE_HIGHLIGHT", { id });
	if (!response?.success) {
		throw new Error(`[HighlightService] Failed to delete: DB_DELETE_HIGHLIGHT`);
	}
};

export const deleteAllHighlightsByPostId = async (postId: string) => {
	const response = await sendMessage("DB_DELETE_ALL_HIGHLIGHTS_BY_POST_ID", {
		postId,
	});

	if (!response?.success) {
		throw new Error(
			`[HighlightService] Failed to delete: DB_DELETE_ALL_HIGHLIGHTS_BY_POST_ID`,
		);
	}
};

// 포스트
export const createPost = async (data: LocalPost) => {
	const response = await sendMessage("DB_CREATE_POST", { postData: data });

	if (!response?.success) {
		throw new Error(`[HighlightService] Failed to create: DB_CREATE_POST`);
	}

	return data;
};

export const updatePost = async ({
	postId,
	updates,
}: {
	postId: string;
	updates: Partial<LocalPost>;
}) => {
	const response = await sendMessage("DB_UPDATE_POST", { postId, updates });

	if (!response?.success) {
		throw new Error(`[HighlightService] Failed to update: DB_UPDATE_POST`);
	}
};

export const getPostById = async (id: string): Promise<LocalPost> => {
	const post = await sendMessage("DB_GET_POST_BY_ID", { postId: id });

	if (post === undefined) {
		throw Error(`[HighlightService] Failed to read: DB_GET_POST_BY_ID`);
	}

	return post;
};

export const getPostByUrl = async (
	url: string,
): Promise<LocalPost | undefined> => {
	const post = await sendMessage("DB_GET_POST_BY_URL", { url });

	return post;
};

export const getAllPosts = async (): Promise<LocalPost[]> => {
	const allPosts = await sendMessage("DB_GET_ALL_POSTS");

	if (allPosts === undefined) {
		throw Error(`[HighlightService] Failed to read: DB_GET_ALL_POSTS`);
	}

	return allPosts;
};

export const deletePost = async (postId: string) => {
	const response = await sendMessage("DB_DELETE_POST", { postId });

	if (!response?.success) {
		throw Error(`[HighlightService] Failed to delete: DB_DELETE_POST`);
	}
};

// 로그인
export const saveLoginSession = async (session: unknown) => {
	const response = await sendMessage("LOGIN_SUCCESS", { session });

	if (!response?.success) {
		throw Error(`[AuthService] Failed to save: LOGIN_SUCCESS`);
	}
};
