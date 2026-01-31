import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useIsMobile } from "../hooks/useIsMobile";
import { useShareId } from "../hooks/useShareId";
import { annotationQueryOptions } from "../queries/annotation";
import { postQueryOptions } from "../queries/post";
import type { Database } from "../types/database.types";

type AnnotationRow = Database["public"]["Tables"]["annotations"]["Row"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];

const getGridConfig = (isMobile: boolean) =>
	isMobile
		? { cols: 2, rows: 4, bookmarkCells: 2 }
		: { cols: 5, rows: 5, bookmarkCells: 4 };

export const SharePage = () => {
	const isMobile = useIsMobile();

	return (
		<ErrorBoundary fallback={<NotFoundFallback />}>
			<div
				style={{
					padding: isMobile ? "24px 16px" : "64px",
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
	const isMobile = useIsMobile();
	const { cols, rows, bookmarkCells } = getGridConfig(isMobile);
	const totalCells = cols * rows;

	const gridItems = useMemo(() => {
		const availableCells = totalCells - bookmarkCells;

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
	}, [highlights, totalCells, bookmarkCells]);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gridTemplateRows: `repeat(${rows}, 1fr)`,
				gap: isMobile ? "8px" : "12px",
				width: "100%",
				maxWidth: isMobile ? "400px" : "1000px",
				aspectRatio: isMobile ? "1/2" : "1/1",
			}}
			className="shared-page-grid"
		>
			{/* Bookmark */}
			<a
				href={getShareableLink(highlights, post)}
				style={{
					gridColumn: isMobile ? "1 / 3" : "1 / 3",
					gridRow: isMobile ? "1 / 2" : "1 / 3",
					border: "1px solid #e5e5e5",
					borderRadius: isMobile ? "16px" : "24px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: isMobile ? "16px" : "24px",
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
							marginBottom: isMobile ? "8px" : "16px",
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
						<span style={{ fontSize: isMobile ? "12px" : "14px", color: "#495057" }}>
							{new URL(post.url).hostname}
						</span>
					</div>
					<h3
						style={{
							fontSize: isMobile ? "14px" : "18px",
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
						borderRadius: isMobile ? "16px" : "24px",
						padding: isMobile ? "12px" : "16px",
						backgroundColor: item.text ? "#fff" : "#EBEBEB",
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "flex-start",
						fontSize: isMobile ? "12px" : "13px",
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
								WebkitLineClamp: isMobile ? 3 : 4,
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

const NotFoundFallback = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "100vh",
			padding: "24px",
			textAlign: "center",
		}}
	>
		<div
			style={{
				marginBottom: "24px",
			}}
		>
			<img src="/logo.svg" alt="logo" width={64} height={64} />
		</div>
		<h1
			style={{
				fontSize: "24px",
				fontWeight: "700",
				color: "#1a1a1a",
				marginBottom: "12px",
			}}
		>
			공유가 중단되었어요
		</h1>
		<p
			style={{
				fontSize: "16px",
				color: "#6b7280",
				lineHeight: "1.6",
			}}
		>
			이 페이지는 삭제되었거나, 작성자가 공유를 취소했어요
		</p>
	</div>
);
