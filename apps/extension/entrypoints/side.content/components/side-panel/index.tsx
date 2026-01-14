import type { TabType } from "../FloatingTab";
import { SidePanelHeader } from "./SidePanelHeader";
import { SidePanelPostList } from "./SidePanelPostList";

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
	// const { currentPost } = useCurrentPost();

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
				padding: "20px",
			}}
		>
			<SidePanelHeader setIsOpen={setIsOpen} />
			<SidePanelPostList />
		</div>
	);
};
