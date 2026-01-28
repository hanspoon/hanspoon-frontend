import { useDrag } from "../hooks/useDrag";
import { useFloatingButtonStatus } from "../hooks/useFloatingButtonStatus";
import { useSidePanel } from "../hooks/useSidePanel";
import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { SidePanel } from "./side-panel";

export const FloatingTab = () => {
	const { isOpen, sideWidth, setIsOpen } = useSidePanel(400);
	const { isEnabledForCurrentSite, disableForCurrentSite, disableGlobally } =
		useFloatingButtonStatus();
	const { elementRef, handleMouseDown, handleClick, isDragging, y } = useDrag({
		initialY: 100,
		onClick: () => setIsOpen(!isOpen),
	});

	const enabled = isEnabledForCurrentSite();

	if (!enabled) {
		return null;
	}

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				ref={elementRef}
				onMouseDown={handleMouseDown}
				style={{
					position: "fixed",
					top: `${y}px`,
					right: isOpen ? `${sideWidth}px` : "0px",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: "12px",
					zIndex: 2147483646,
					cursor: isDragging ? "grabbing" : "grab",
					transition: isDragging ? "none" : "right 0.3s ease",
				}}
			>
				<HanspoonFloatingButton
					isDragging={isDragging}
					onClick={handleClick}
					onDisableForSite={() => {
						disableForCurrentSite();
					}}
					onDisableGlobally={() => {
						disableGlobally();
					}}
				/>
			</div>

			<SidePanel sideWidth={sideWidth} isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
};
