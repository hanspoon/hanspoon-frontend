import { addPost, getPostByUrl, saveHighlight } from "@/apis/fetcher";
import type { ClientRect } from "@/hooks/useTextSelection";
import { appendHighlightTag, generateId } from "@/lib/highlight/highlight";
import { serializeRange } from "@/lib/highlight/serialization";
import { extractPostData } from "@/lib/post/postExtractor";

export const CreationModeUI = ({
	targetRect,
	range,
}: {
	targetRect: ClientRect;
	range: Range;
}) => {
	const { top, left } = calculatePosition(targetRect);

	return (
		<div
			style={{
				position: "absolute",
				top: `${top}px`,
				left: `${left}px`,
				transform: "translateX(-50%)",
				background: "black",
				color: "white",
				padding: "8px 12px",
				borderRadius: "8px",
				zIndex: 9999,
				display: "flex",
				alignItems: "center",
				gap: "8px",
				fontSize: "14px",
			}}
		>
			<button
				type="button"
				onClick={async () => {
					try {
						const post = await ensurePostbyUrl(window.location.href);

						const { postId } = await saveHighlight({
							data: serializeRange({
								range,
								id: generateId(),
								$root: document.body,
							}),
							postId: post.id,
						});

						appendHighlightTag(range, postId);
					} catch (error) {
						console.error("Failed to save highlight:", error);
					}
				}}
				style={{
					background: "none",
					border: "none",
					cursor: "pointer",
				}}
			>
				하이라이트
			</button>

			<span style={{ opacity: 0.5 }}>|</span>
			<button
				type="button"
				style={{
					background: "none",
					border: "none",
					color: "inherit",
					cursor: "pointer",
				}}
			>
				메모
			</button>
		</div>
	);
};

const ensurePostbyUrl = async (url: string) => {
	const post = await getPostByUrl(url);

	if (post === undefined) {
		const postData = extractPostData();
		const fetchedPost = await addPost({ ...postData, updatedAt: Date.now() });
		return fetchedPost;
	}

	return post;
};

function calculatePosition(targetRect: ClientRect) {
	const top = targetRect.top + window.scrollY - 50;
	const left = targetRect.left + targetRect.width / 2 + window.scrollX;

	return {
		top,
		left,
	};
}
