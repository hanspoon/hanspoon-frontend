import type { TabType } from "../FloatingTab";

interface SidePanelProps {
	sideWidth: number;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	activeTab: TabType;
}

export const SidePanel = ({
	sideWidth,
	isOpen,
	setIsOpen,
	activeTab,
}: SidePanelProps) => {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				right: 0,
				height: "100vh",
				width: `${sideWidth}px`,
				backgroundColor: "white",
				boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
				transform: isOpen ? "translateX(0)" : "translateX(100%)",
				transition: "transform 0.3s ease",
				zIndex: 2147483647,
				display: "flex",
				flexDirection: "column",
				borderLeft: "1px solid #e5e7eb",
			}}
		>
			<div
				style={{
					padding: "20px",
					borderBottom: "1px solid #e5e7eb",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
					{activeTab === "share" ? "Share Panel" : "Hanspoon Panel"}
				</h2>
				<button
					type="button"
					onClick={() => setIsOpen(false)}
					style={{
						background: "none",
						border: "none",
						fontSize: "24px",
						cursor: "pointer",
						color: "#6b7280",
					}}
				>
					✕
				</button>
			</div>

			<div
				style={{
					flex: 1,
					padding: "20px",
					overflowY: "auto",
				}}
			>
				{activeTab === "share"
					? "ShareFloatingButton입니다."
					: "HanspoonFloatingButton입니다."}
			</div>
		</div>
	);
};
