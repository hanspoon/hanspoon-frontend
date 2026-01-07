import type { LocalPost } from "@/lib/highlight/types";
import { PostCard } from "./PostCard";

interface CurrentPostInterface {
	currentPost: LocalPost;
}

export const CurrentPost = ({ currentPost }: CurrentPostInterface) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "8px",
			}}
		>
			<div
				style={{
					fontSize: "14px",
				}}
			>
				현재 페이지
			</div>
			<PostCard post={currentPost} />
		</div>
	);
};
