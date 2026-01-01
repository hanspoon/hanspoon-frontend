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
