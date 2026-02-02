import logo from "../../../../public/logo.png";
import { useFloatingButtonStatus } from "../../hooks/useFloatingButtonStatus";
import { Dropdown, type DropdownMenuItem } from "../common/Dropdown";

interface HanspoonFloatingButtonProps {
	isDragging: boolean;
	onClick: () => void;
}

export const HanspoonFloatingButton = ({
	isDragging,
	onClick,
}: HanspoonFloatingButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const { disableForCurrentSite, disableGlobally } = useFloatingButtonStatus();

	const menuItems: DropdownMenuItem[] = [
		{
			label: "이 사이트에서 비활성화",
			onClick: () => {
				console.log("이 사이트에서 비활성화");
				disableForCurrentSite();
			},
		},
		{
			label: "전역으로 비활성화",
			onClick: () => {
				console.log("전역으로 비활성화");
				disableGlobally();
			},
		},
	];

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <>
		<div
			style={{ position: "relative" }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Dropdown
				trigger={
					<button
						type="button"
						style={{
							width: "12px",
							height: "12px",
							borderRadius: "50%",
							backgroundColor: "white",
							border: "1px solid #e5e7eb",
							cursor: "pointer",
							boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
							fontSize: "8px",
							display: isHovered ? "flex" : "none",
							alignItems: "center",
							justifyContent: "center",
							color: "#6b7280",
							opacity: isHovered ? 1 : 0,
							transform: isHovered ? "translateY(0)" : "translateY(20px)",
							transition: "all 0.3s ease 0.1s",
							pointerEvents: isHovered ? "auto" : "none",
						}}
					>
						✕
					</button>
				}
				items={menuItems}
				position="bottom-left"
			/>
			<button
				type="button"
				onClick={onClick}
				style={{
					width: "52px",
					height: "34px",
					borderTopLeftRadius: "30px",
					borderBottomLeftRadius: "30px",
					backgroundColor: "white",
					border: "none",
					cursor: isDragging ? "grabbing" : "grab",
					boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: isDragging ? "none" : "all 0.3s ease",
				}}
			>
				<img src={logo} alt="logo" width={24} height={24} />
			</button>
		</div>
	);
};
