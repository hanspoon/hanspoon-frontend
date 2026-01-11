import { type ReactNode, useEffect, useRef, useState } from "react";

export interface DropdownMenuItem {
	label: string;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
	icon?: string;
}

interface DropdownProps {
	trigger: ReactNode;
	items: DropdownMenuItem[];
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
	menuClassName?: string;
	itemClassName?: string;
}

export const Dropdown = ({
	trigger,
	items,
	position = "bottom-right",
	menuClassName = "",
	itemClassName = "",
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			const timer = setTimeout(() => {
				document.addEventListener("click", handleClickOutside);
			}, 0);

			return () => {
				clearTimeout(timer);
				document.removeEventListener("click", handleClickOutside);
			};
		}
	}, [isOpen]);

	const getPositionStyles = () => {
		const baseStyles = {
			position: "absolute" as const,
			backgroundColor: "white",
			border: "1px solid #e5e7eb",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			padding: "4px",
			minWidth: "200px",
			zIndex: 2147483648,
		};

		switch (position) {
			case "top-right":
				return {
					...baseStyles,
					bottom: "100%",
					right: 10,
					marginBottom: "8px",
				};
			case "top-left":
				return { ...baseStyles, bottom: "100%", left: 10, marginBottom: "8px" };
			case "bottom-left":
				return { ...baseStyles, top: "100%", left: 10, marginTop: "8px" };
			default:
				return { ...baseStyles, top: "100%", right: 10, marginTop: "8px" };
		}
	};

	return (
		<div style={{ position: "relative" }} ref={dropdownRef}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static div */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: no click event */}
			<div
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
			>
				{trigger}
			</div>

			{isOpen && (
				<div style={getPositionStyles()} className={menuClassName}>
					{items.map((item, index) => {
						return (
							<button
								key={`${item.label}-${index}`}
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									if (!item.disabled) {
										item.onClick();
										setIsOpen(false);
									}
								}}
								className={itemClassName}
								disabled={item.disabled}
								style={{
									width: "100%",
									padding: "8px 12px",
									textAlign: "left",
									backgroundColor: "transparent",
									border: "none",
									borderRadius: "4px",
									cursor: item.disabled ? "not-allowed" : "pointer",
									fontSize: "14px",
									color: item.disabled ? "#9ca3af" : "#374151",
									opacity: item.disabled ? 0.6 : 1,
								}}
								onMouseEnter={(e) => {
									if (!item.disabled) {
										e.currentTarget.style.backgroundColor = "#f3f4f6";
									}
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "transparent";
								}}
							>
								{item.icon && (
									<span style={{ marginRight: "8px" }}>{item.icon}</span>
								)}
								{item.label}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
