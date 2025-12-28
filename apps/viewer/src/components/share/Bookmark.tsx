import { useSuspenseQuery } from "@tanstack/react-query";
import { useShareId } from "../../hooks/useShareId";
import { postQueryOptions } from "../../queries/post";

export const Bookmark = () => {
	const currentShareId = useShareId();
	const { data: post } = useSuspenseQuery(postQueryOptions(currentShareId));

	return (
		<a
			href={post.url}
			style={{
				width: "820px",
				height: "175px",
				borderRadius: "24px",
				border: "1px solid #e5e5e5",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<div
				style={{
					padding: "24px",
				}}
			>
				<p>{post.title}</p>
				<p style={{ color: "#565656" }}>{post.url}</p>
			</div>
			<img
				src="https://i.pinimg.com/1200x/7d/ef/1e/7def1e13b878405623f041c5b96e7a60.jpg"
				alt="profile_image"
				width={234}
				height={175}
				style={{
					objectFit: "cover",
					borderTopRightRadius: "24px",
					borderBottomRightRadius: "24px",
				}}
			/>
		</a>
	);
};
