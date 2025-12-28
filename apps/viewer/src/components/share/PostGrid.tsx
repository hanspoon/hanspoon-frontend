import { useSuspenseQuery } from "@tanstack/react-query";
import { allPostQueryOptions } from "../../queries/post";

export const PostGrid = () => {
	const { data: posts } = useSuspenseQuery(allPostQueryOptions());

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: "12px",
			}}
		>
			{posts?.map((post) => (
				<div
					key={post.id}
					style={{
						border: "1px solid #EBEBEB",
						aspectRatio: "1/1",
						borderRadius: "24px",
						padding: "24px",
					}}
				>
					{post.title}
				</div>
			))}
		</div>
	);
};
