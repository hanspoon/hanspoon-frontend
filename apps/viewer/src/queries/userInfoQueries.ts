import { queryOptions } from "@tanstack/react-query";
import { fetchUserInfo } from "../apis/auth.api";

export const userInfoQueries = {
	all: () => ["userInfo"] as const,
	detail: () =>
		queryOptions({
			queryKey: userInfoQueries.all(),
			queryFn: () => fetchUserInfo(),
		}),
};
