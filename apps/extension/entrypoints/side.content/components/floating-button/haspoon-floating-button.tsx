interface HanspoonFloatingButtonProps {
	handleMouseDown: (e: React.MouseEvent) => void;
	setIsOpen: (value: boolean) => void;
	isDragging: boolean;
	isOpen: boolean;
	isHover: boolean;
	hasMoved: boolean;
}

export const HanspoonFloatingButton = ({
	handleMouseDown,
	setIsOpen,
	isDragging,
	isOpen,
	isHover,
	hasMoved,
}: HanspoonFloatingButtonProps) => {
	return (
		<div>
			<button
				type="button"
				onClick={() => setIsOpen(false)}
				style={{
					width: "12px",
					height: "12px",
					borderRadius: "50%",
					backgroundColor: "white",
					border: "1px solid #e5e7eb",
					cursor: "pointer",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					fontSize: "8px",
					display: isHover ? "flex" : "none",
					alignItems: "center",
					justifyContent: "center",
					color: "#6b7280",
					opacity: isHover ? 1 : 0,
					transform: isHover ? "translateY(0)" : "translateY(20px)",
					transition: "all 0.3s ease 0.1s",
					pointerEvents: isHover ? "auto" : "none",
				}}
			>
				✕
			</button>
			<button
				type="button"
				onMouseDown={handleMouseDown}
				onClick={() => {
					if (!hasMoved) {
						setIsOpen(!isOpen);
					}
				}}
				style={{
					width: "60px",
					height: "40px",
					borderTopLeftRadius: "30px",
					borderBottomLeftRadius: "30px",
					backgroundColor: "#4ade80",
					border: "none",
					cursor: isDragging ? "grabbing" : "grab",
					boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					fontSize: "28px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: isDragging ? "none" : "all 0.3s ease",
				}}
			>
				🥄
			</button>
		</div>
	);
};
