import { useEffect, useRef, useState } from "react";

interface HanspoonFloatingButtonProps {
	handleMouseDown: (e: React.MouseEvent) => void;
	isDragging: boolean;
	isHover: boolean;
	hasMoved: boolean;
	onClick: () => void;
	onDisableForSite: () => void;
	onDisableGlobally: () => void;
}

export const HanspoonFloatingButton = ({
	handleMouseDown,
	isDragging,
	isHover,
	hasMoved,
	onClick,
	onDisableForSite,
	onDisableGlobally,
}: HanspoonFloatingButtonProps) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown]);

	const handleDisableForSite = () => {
		onDisableForSite();
		// disableForCurrentSite();
		setShowDropdown(false);
	};

	const handleDisableGlobally = () => {
		onDisableGlobally();
		// disableGlobally();
		setShowDropdown(false);
	};

	return (
		<div style={{ position: "relative" }}>
			<div ref={dropdownRef}>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						if (!hasMoved) {
							setShowDropdown(!showDropdown);
						}
					}}
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

				{showDropdown && (
					<div
						style={{
							position: "absolute",
							top: "0",
							right: "20px",
							backgroundColor: "white",
							border: "1px solid #e5e7eb",
							borderRadius: "8px",
							boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
							padding: "4px",
							minWidth: "200px",
							zIndex: 2147483648,
						}}
					>
						<button
							type="button"
							onClick={() => {
								console.log("이 사이트에서 비활성화");
								handleDisableForSite();
							}}
							style={{
								width: "100%",
								padding: "8px 12px",
								textAlign: "left",
								backgroundColor: "transparent",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
								fontSize: "14px",
								color: "#374151",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#f3f4f6";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							이 사이트에서 비활성화
						</button>
						<button
							type="button"
							onClick={() => {
								console.log("전역으로 비활성화");
								handleDisableGlobally();
							}}
							style={{
								width: "100%",
								padding: "8px 12px",
								textAlign: "left",
								backgroundColor: "transparent",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
								fontSize: "14px",
								color: "#374151",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#f3f4f6";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}
						>
							전역으로 비활성화
						</button>
					</div>
				)}
			</div>
			<button
				type="button"
				onMouseDown={handleMouseDown}
				onClick={onClick}
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
