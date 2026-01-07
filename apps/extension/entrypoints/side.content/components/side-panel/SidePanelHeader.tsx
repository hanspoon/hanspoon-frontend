interface SidePanelHeaderProps {
	setIsOpen: (value: boolean) => void;
}

export const SidePanelHeader = ({ setIsOpen }: SidePanelHeaderProps) => {
	return (
		<div
			style={{
				padding: "20px",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>한스푼</h2>
			<button
				type="button"
				onClick={() => setIsOpen(false)}
				style={{
					background: "none",
					border: "none",
					fontSize: "12px",
					cursor: "pointer",
					color: "#6b7280",
				}}
			>
				✕
			</button>
		</div>
	);
};
