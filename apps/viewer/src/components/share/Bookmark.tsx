import { useSuspenseQuery } from "@tanstack/react-query";
import { useShareId } from "../../hooks/useShareId";
import { annotationQueryOptions } from "../../queries/annotation";
import { postQueryOptions } from "../../queries/post";
import type { Database } from "../../types/database.types";

export const Bookmark = () => {
	const currentShareId = useShareId();

	const { data: post } = useSuspenseQuery(postQueryOptions(currentShareId));

	const { data: highlights } = useSuspenseQuery(
		annotationQueryOptions(currentShareId),
	);

	return (
		<a
			href={getShareableLink(highlights, post)}
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

type AnnotationRow = Database["public"]["Tables"]["annotations"]["Row"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];

function getShareableLink(highlights: AnnotationRow[], post: PostRow) {
	const fragmentParams = highlights
		.filter((h) => h.text)
		.map((h) => convertToTextFragmentUrl(h.text));

	if (fragmentParams.length > 0) {
		return `${post.url}#:~:text=${fragmentParams.join("&text=")}`;
	}

	return post.url;
}

function convertToTextFragmentUrl(highlightText: string): string {
	const cleanText = highlightText.trim().replace(/\s+/g, " ");

	const encode = (str: string) =>
		encodeURIComponent(str).replace(/-/g, "%2d").replace(/,/g, "%2c");

	let fragmentParams = "";
	const words = cleanText.split(" ");

	if (words.length > 10) {
		const start = encode(words.slice(0, 4).join(" "));
		const end = encode(words.slice(-4).join(" "));
		fragmentParams = `${start},${end}`;
	} else {
		fragmentParams = encode(cleanText);
	}

	return `${fragmentParams}`;
}
