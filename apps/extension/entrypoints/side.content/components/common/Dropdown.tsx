import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
	const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node) &&
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
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

	useEffect(() => {
		if (isOpen && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			const menuWidth = 200;
			const menuHeight = 150;
			const gap = 8;

			let top = 0;
			let left = 0;

			switch (position) {
				case "top-right":
					top = rect.top - menuHeight - gap;
					left = rect.right - menuWidth;
					break;
				case "top-left":
					top = rect.top - menuHeight - gap;
					left = rect.left;
					break;
				case "bottom-left":
					top = rect.bottom + gap;
					left = rect.left;
					break;
				default:
					top = rect.bottom + gap;
					left = rect.right - menuWidth;
					break;
			}

			setMenuPosition({ top, left });
		}
	}, [isOpen, position]);

	const menuStyles = {
		position: "fixed" as const,
		top: menuPosition.top,
		left: menuPosition.left,
		backgroundColor: "white",
		border: "1px solid #e5e7eb",
		borderRadius: "8px",
		boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
		padding: "4px",
		minWidth: "200px",
		zIndex: 2147483648,
	};

	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static div */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: no click event */}
			<div
				ref={triggerRef}
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
			>
				{trigger}
			</div>

			{isOpen &&
				createPortal(
					<div ref={menuRef} style={menuStyles} className={menuClassName}>
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
									{item.label}
									{item.icon && (
										<span style={{ marginRight: "8px" }}>{item.icon}</span>
									)}
								</button>
							);
						})}
					</div>,
					document.body,
				)}
		</>
	);
};
