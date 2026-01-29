import { deleteHighlight } from "@/apis/fetcher";
import { removeHighlight } from "@/lib/highlight/remove";
import { useHighlightSelection } from "../../hooks/useHighlightSelection";

export const EditModeUI = () => {
	const { clickedHighlight, clearHighlightSelection } = useHighlightSelection();

	if (clickedHighlight === null) {
		return null;
	}

	const targetRect = clickedHighlight.rect;
	const { top, left } = calculatePosition(targetRect);

	return (
		<div
			data-testid="highlight-toolbar"
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
				data-testid="highlight-button"
				type="button"
				onClick={async () => {
					if (clickedHighlight) {
						removeHighlight(clickedHighlight.id);
						await deleteHighlight(clickedHighlight.id);
						clearHighlightSelection();
					}
				}}
			>
				Unhighlight
			</button>
		</div>
	);
};

export function calculatePosition(targetRect: DOMRect) {
	const top = targetRect.top + window.scrollY - 50;
	const left = targetRect.left + targetRect.width / 2 + window.scrollX;

	return {
		top,
		left,
	};
}
