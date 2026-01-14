interface SidePanelHeaderProps {
	setIsOpen: (value: boolean) => void;
}

export const SidePanelHeader = ({ setIsOpen }: SidePanelHeaderProps) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
			}}
		>
			<button
				className="close-button"
				type="button"
				onClick={() => setIsOpen(false)}
				style={{
					background: "none",
					border: "none",
					fontSize: "12px",
					cursor: "pointer",
					color: "#6b7280",
					transition: "transform 0.1s ease",
				}}
			>
				✕
			</button>
			<style>{`
				.close-button:active {
					transform: scale(0.8);
				}
				.close-button:hover {
					color: black;
				}
			`}</style>
		</div>
	);
};
