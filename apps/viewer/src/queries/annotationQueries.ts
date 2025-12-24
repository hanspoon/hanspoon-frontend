import { queryOptions } from "@tanstack/react-query";
import { fetchAnnotations } from "../apis/share.api";

export const annotationQueries = {
	all: () => ["annotations"] as const,
	detail: (shareId: string) =>
		queryOptions({
			queryKey: [...annotationQueries.all(), shareId],
			queryFn: () => fetchAnnotations(shareId),
			enabled: !!shareId,
		}),
};
