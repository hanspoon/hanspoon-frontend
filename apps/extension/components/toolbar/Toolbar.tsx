import { deleteHighlight, saveHighlight } from "@/apis/fetcher";
import { type ClientRect, useTextSelection } from "@/hooks/useTextSelection";
import { appendHighlightTag, generateId } from "@/lib/highlight/highlight";
import { removeHighlight } from "@/lib/highlight/remove";
import { serializeRange } from "@/lib/highlight/serialization";

const Toolbar = () => {
	const { clientRect, isCollapsed, range } = useTextSelection();
	const { clickedHighlight, clearHighlightSelection } = useHighlightSelection();

	const isNotSelected = clientRect === undefined;

	if (isNotSelected) {
		return null;
	}

	const isCreationMode = !isCollapsed && range !== undefined;
	const isEditMode = clickedHighlight !== null;

	if (!isCreationMode && !isEditMode) {
		return null;
	}

	const targetRect = isEditMode ? clickedHighlight.rect : clientRect;
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
			{isCreationMode ? (
				<button
					type="button"
					onClick={async () => {
						const id = generateId();
						const serializedData = serializeRange({
							range,
							id,
							$root: document.body,
						});
						await saveHighlight(serializedData);
						appendHighlightTag(range, id);
					}}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
					}}
				>
					하이라이트
				</button>
			) : (
				<button
					type="button"
					onClick={async () => {
						if (clickedHighlight) {
							removeHighlight(clickedHighlight.id);
							await deleteHighlight(clickedHighlight.id);
							clearHighlightSelection();
						}
					}}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
					}}
				>
					하이라이트 취소
				</button>
			)}
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

function calculatePosition(targetRect: DOMRect | ClientRect) {
	const top = targetRect.top + window.scrollY - 50;
	const left = targetRect.left + targetRect.width / 2 + window.scrollX;

	return {
		top,
		left,
	};
}

export default Toolbar;
