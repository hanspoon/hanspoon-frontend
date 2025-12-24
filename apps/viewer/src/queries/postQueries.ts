import { queryOptions } from "@tanstack/react-query";
import { fetchPost } from "../apis/share.api";

export const postQueries = {
	all: () => ["posts"] as const,
	detail: (shareId: string) =>
		queryOptions({
			queryKey: [...postQueries.all(), shareId],
			queryFn: () => fetchPost(shareId),
			enabled: !!shareId,
		}),
};
