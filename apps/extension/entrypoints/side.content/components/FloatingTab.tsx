import { useState } from "react";
import { useDrag } from "../hooks/useDrag";
import { useFloatingButtonConfig } from "../hooks/useFloatingButtonConfig";
import { useSidePanel } from "../hooks/useSidePanel";
import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { ShareFloatingButton } from "./floating-button/share-floating-button";
import { SidePanel } from "./side-panel";

export type TabType = "share" | "hanspoon";

export const FloatingTab = () => {
	const { yRatio, isDragging, hasMoved, handleMouseDown } = useDrag(0.5);
	const { isOpen, sideWidth, setIsOpen } = useSidePanel(400);
	const {
		config,
		isLoaded,
		isEnabledForCurrentSite,
		disableForCurrentSite,
		disableGlobally,
	} = useFloatingButtonConfig();

	const [isHovered, setIsHovered] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("hanspoon");
	const [showDebug, setShowDebug] = useState(false);

	if (!isLoaded) {
		return (
			<div
				style={{
					position: "fixed",
					top: "10px",
					right: "10px",
					padding: "10px",
					background: "yellow",
					border: "2px solid red",
					zIndex: 9999999,
				}}
			>
				⏳ Loading config...
			</div>
		);
	}

	const enabled = isEnabledForCurrentSite();

	if (!enabled) {
		return (
			<div
				style={{
					position: "fixed",
					top: "10px",
					right: "10px",
					padding: "10px",
					background: "orange",
					border: "2px solid red",
					zIndex: 9999999,
					fontSize: "12px",
				}}
			>
				🚫 Disabled for: {window.location.hostname}
				<br />
				Config: {JSON.stringify(config)}
			</div>
		);
	}

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{showDebug && (
				<div
					style={{
						position: "fixed",
						top: "10px",
						left: "10px",
						padding: "10px",
						background: "white",
						border: "2px solid #4ade80",
						borderRadius: "8px",
						zIndex: 9999999,
						fontSize: "12px",
						maxWidth: "350px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					}}
				>
					<div style={{ fontWeight: "bold", marginBottom: "8px" }}>
						Hanspoon Debug Panel
					</div>
					<div style={{ marginBottom: "4px" }}>
						Domain: <strong>{window.location.hostname}</strong>
					</div>
					<div style={{ marginBottom: "4px" }}>
						Enabled: {enabled ? "✅" : "❌"}
					</div>
					<div style={{ marginBottom: "8px", fontSize: "10px" }}>
						Config: <pre>{JSON.stringify(config, null, 2)}</pre>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "5px",
							marginTop: "10px",
						}}
					>
						<button
							type="button"
							onClick={() => {
								alert("테스트 클릭 성공!");
							}}
							style={{
								padding: "8px",
								background: "#3b82f6",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
								fontWeight: "bold",
							}}
						>
							🧪 클릭 테스트
						</button>

						<button
							type="button"
							onClick={() => {
								alert("비활성화 함수 호출!");
								disableForCurrentSite();
							}}
							style={{
								padding: "8px",
								background: "#ef4444",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							🚫 이 사이트 비활성화
						</button>

						<button
							type="button"
							onClick={() => {
								alert("전역 비활성화 함수 호출!");
								disableGlobally();
							}}
							style={{
								padding: "8px",
								background: "#f59e0b",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							🌍 전역 비활성화
						</button>

						<button
							type="button"
							onClick={() => setShowDebug(false)}
							style={{
								marginTop: "5px",
								padding: "5px 10px",
								border: "1px solid #ccc",
								borderRadius: "4px",
								cursor: "pointer",
								background: "white",
							}}
						>
							Hide Debug
						</button>
					</div>
				</div>
			)}

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
				<ShareFloatingButton
					isHovered={isHovered}
					hasMoved={hasMoved}
					onClick={() => {
						setActiveTab("share");
						setIsOpen(true);
					}}
				/>

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
