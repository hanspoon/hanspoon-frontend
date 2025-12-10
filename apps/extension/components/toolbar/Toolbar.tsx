import { useTextSelection } from "@/hooks/useTextSelection";
import { applyHighlight } from "@/utils/highlight/serialization";

const Toolbar = () => {
	const { clientRect, isCollapsed, range } = useTextSelection();

	if (isCollapsed || !clientRect || !range) return null;

	const top = clientRect.top + window.scrollY - 50;
	const left = clientRect.left + clientRect.width / 2 + window.scrollX;

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
				cursor: "pointer",
			}}
		>
			<button type="button" onClick={() => applyHighlight(range)}>
				하이라이트
			</button>
			<span> | </span>
			<span>메모</span>
		</div>
	);
};

export default Toolbar;
