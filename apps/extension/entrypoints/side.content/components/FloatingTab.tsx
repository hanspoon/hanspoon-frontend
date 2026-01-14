import { useState } from "react";
import { useDrag } from "../hooks/useDrag";
import { useFloatingButtonStatus } from "../hooks/useFloatingButtonStatus";
import { useSidePanel } from "../hooks/useSidePanel";
import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { SidePanel } from "./side-panel";

export type TabType = "share" | "hanspoon";

export const FloatingTab = () => {
	const { yRatio, isDragging, hasMoved, handleMouseDown } = useDrag(0.5);
	const { isOpen, sideWidth, setIsOpen } = useSidePanel(400);
	const { isEnabledForCurrentSite, disableForCurrentSite, disableGlobally } =
		useFloatingButtonStatus();

	const [isHovered, setIsHovered] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("hanspoon");

	const enabled = isEnabledForCurrentSite();

	if (!enabled) {
		return null;
	}

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					position: "fixed",
					top: `${yRatio * 100}vh`,
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
				{/* <ShareFloatingButton
					isHovered={isHovered}
					hasMoved={hasMoved}
					onClick={() => {
						setActiveTab("share");
						setIsOpen(true);
					}}
				/> */}

				<HanspoonFloatingButton
					isHover={isHovered}
					handleMouseDown={handleMouseDown}
					isDragging={isDragging}
					hasMoved={hasMoved}
					onClick={() => {
						if (!hasMoved) {
							setActiveTab("hanspoon");
							setIsOpen(!isOpen);
						}
					}}
					onDisableForSite={() => {
						disableForCurrentSite();
					}}
					onDisableGlobally={() => {
						disableGlobally();
					}}
				/>
			</div>

			<SidePanel
				sideWidth={sideWidth}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				activeTab={activeTab}
			/>
		</div>
	);
};
