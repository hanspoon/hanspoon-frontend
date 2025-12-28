import { queryOptions } from "@tanstack/react-query";
import { fetchAllPost, fetchPost } from "../apis/share.api";

export const postQueryOptions = (shareId: string) =>
	queryOptions({
		queryKey: ["post", shareId],
		queryFn: () => fetchPost(shareId),
		enabled: !!shareId,
	});

export const allPostQueryOptions = () =>
	queryOptions({
		queryKey: ["post"],
		queryFn: () => fetchAllPost(),
	});
