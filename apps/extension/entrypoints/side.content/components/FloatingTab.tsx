import { useRef, useState } from "react";
import { useFloatingButtonStatus } from "../hooks/useFloatingButtonStatus";
import { useSidePanel } from "../hooks/useSidePanel";
import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { SidePanel } from "./side-panel";

const DRAG_THRESHOLD = 5;

export const FloatingTab = () => {
	const { isOpen, sideWidth, setIsOpen } = useSidePanel(400);
	const { isEnabledForCurrentSite, disableForCurrentSite, disableGlobally } =
		useFloatingButtonStatus();

	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [y, setY] = useState(100);

	const elementRef = useRef<HTMLDivElement | null>(null);
	const mousePositionRef = useRef<number | null>(null);
	const offset = useRef<number | null>(null);
	const startY = useRef<number | null>(null);
	const hasDragged = useRef(false);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mousePositionRef.current = e.clientY;

			if (startY.current === null || offset.current === null) {
				return;
			}

			if (
				!hasDragged.current &&
				Math.abs(mousePositionRef.current - startY.current) > DRAG_THRESHOLD
			) {
				hasDragged.current = true;
				setIsDragging(true);
			}

			const newY = mousePositionRef.current - offset.current;
			setY(newY);
		};

		const handleMouseUp = () => {
			mousePositionRef.current = null;
			offset.current = null;
			startY.current = null;
			setIsHovered(false);
			setIsDragging(false);

			setTimeout(() => {
				hasDragged.current = false;
			}, 0);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	const enabled = isEnabledForCurrentSite();

	if (!enabled) {
		return null;
	}

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				ref={elementRef}
				onMouseDown={(e) => {
					e.preventDefault();

					if (elementRef.current === null) {
						return;
					}

					mousePositionRef.current = e.clientY;
					startY.current = e.clientY;
					offset.current =
						mousePositionRef.current -
						elementRef.current.getBoundingClientRect().top;
				}}
				style={{
					position: "fixed",
					top: `${y}px`,
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
				<HanspoonFloatingButton
					isHover={isHovered}
					isDragging={isDragging}
					onClick={() => {
						if (!hasDragged.current) {
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

			<SidePanel sideWidth={sideWidth} isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
};
