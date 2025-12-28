import { queryOptions } from "@tanstack/react-query";
import { fetchUserInfo } from "../apis/auth.api";

export const userInfoQueryOptions = queryOptions({
	queryKey: ["userInfo"],
	queryFn: () => fetchUserInfo(),
});
