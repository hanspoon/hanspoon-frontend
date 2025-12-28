import { queryOptions } from "@tanstack/react-query";
import { fetchAnnotations } from "../apis/share.api";

export const annotationQueryOptions = (shareId: string) =>
	queryOptions({
		queryKey: ["annotations", shareId],
		queryFn: () => fetchAnnotations(shareId),
		enabled: !!shareId,
	});
