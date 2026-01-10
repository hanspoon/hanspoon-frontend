import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useShareId } from "../hooks/useShareId";
import { annotationQueryOptions } from "../queries/annotation";
import { postQueryOptions } from "../queries/post";
import type { Database } from "../types/database.types";

type AnnotationRow = Database["public"]["Tables"]["annotations"]["Row"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];

const GRID_COLS = 5;
const GRID_ROWS = 5;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;
const BOOKMARK_CELLS = 4;

export const SharedPage = () => {
	return (
		<ErrorBoundary fallback={null}>
			<div
				style={{
					padding: "64px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<Suspense fallback={null}>
					<SharedPageContent />
				</Suspense>
			</div>
		</ErrorBoundary>
	);
};

const SharedPageContent = () => {
	const currentShareId = useShareId();
	const { data: post } = useSuspenseQuery(postQueryOptions(currentShareId));
	const { data: highlights } = useSuspenseQuery(
		annotationQueryOptions(currentShareId),
	);

	const gridItems = useMemo(() => {
		const availableCells = TOTAL_CELLS - BOOKMARK_CELLS;

		const cells: Array<{ text: string | null; id: string }> = Array.from(
			{ length: availableCells },
			(_, i) => ({ text: null, id: `empty-${i}` }),
		);

		const shuffledIndices = shuffleArray(
			Array.from({ length: availableCells }, (_, i) => i),
		);

		highlights.forEach((highlight, i) => {
			if (i < shuffledIndices.length && highlight.text) {
				const position = shuffledIndices[i];
				cells[position] = {
					text: highlight.text,
					id: `highlight-${highlight.id || i}`,
				};
			}
		});

		return cells;
	}, [highlights]);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
				gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
				gap: "12px",
				width: "100%",
				maxWidth: "1000px",
				aspectRatio: "1/1",
			}}
			className="shared-page-grid"
		>
			{/* Bookmark */}
			<a
				href={getShareableLink(highlights, post)}
				style={{
					gridColumn: "1 / 3",
					gridRow: "1 / 3",
					border: "1px solid #e5e5e5",
					borderRadius: "24px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "24px",
					textDecoration: "none",
					color: "inherit",
					backgroundColor: "#fff",
					overflow: "hidden",
				}}
			>
				<div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "16px",
						}}
					>
						{post.fav_icon_url && (
							<img
								src={post.fav_icon_url}
								alt=""
								style={{
									width: "16px",
									height: "16px",
									borderRadius: "2px",
								}}
							/>
						)}
						<span style={{ fontSize: "14px", color: "#495057" }}>
							{new URL(post.url).hostname}
						</span>
					</div>
					<h3
						style={{
							fontSize: "18px",
							fontWeight: "700",
							margin: 0,
							lineHeight: "1.5",
						}}
					>
						{post.title}
					</h3>
				</div>
			</a>

			{gridItems.map((item) => (
				<div
					key={item.id}
					style={{
						border: "1px solid #EBEBEB",
						borderRadius: "24px",
						padding: "16px",
						backgroundColor: item.text ? "#fff" : "#EBEBEB",
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "flex-start",
						fontSize: "13px",
						lineHeight: "1.6",
						overflow: "hidden",
						wordBreak: "keep-all",
						textAlign: "center",
					}}
				>
					{item.text && (
						<span
							style={{
								display: "-webkit-box",
								WebkitLineClamp: 4,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{item.text}
						</span>
					)}
				</div>
			))}
		</div>
	);
};

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

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
