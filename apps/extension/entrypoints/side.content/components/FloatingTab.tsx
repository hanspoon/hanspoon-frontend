import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { LibraryFloatingButton } from "./floating-button/library-floating-button";
import { SidePanel } from "./side-panel/SidePanel";

export const FloatingTab = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [sideWidth] = useState(400);
	const [isHovered, setIsHovered] = useState(false);
	const [position, setPosition] = useState(0.5);
	const [isDragging, setIsDragging] = useState(false);
	const initialClientYRef = useRef(0);
	const initialPositionRef = useRef(0);
	const [hasMoved, setHasMoved] = useState(false);

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			const initialY = initialPositionRef.current * window.innerHeight;
			const deltaY = e.clientY - initialClientYRef.current;
			const newY = Math.max(
				30,
				Math.min(
					window.innerHeight - 200,
					initialY + deltaY,
				),
			);
			const newPosition = newY / window.innerHeight;
			setPosition(newPosition);
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setTimeout(() => setHasMoved(false), 100);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	useEffect(() => {
		const styleId = "side-panel-page-shrink";
		let styleTag = document.getElementById(styleId) as HTMLStyleElement;

		if (isOpen) {
			if (!styleTag) {
				styleTag = document.createElement("style");
				styleTag.id = styleId;
				document.head.appendChild(styleTag);
			}
			styleTag.textContent = `
          html {
            width: calc(100% - ${sideWidth}px) !important;
            position: relative !important;
            min-height: 100vh !important;
          }
        `;
		} else {
			if (styleTag) {
				document.head.removeChild(styleTag);
			}
		}

		return () => {
			if (styleTag && document.head.contains(styleTag)) {
				document.head.removeChild(styleTag);
			}
		};
	}, [isOpen, sideWidth]);

	const handleButtonDragStart = (e: React.MouseEvent) => {
		initialClientYRef.current = e.clientY;
		initialPositionRef.current = position;
		setIsDragging(true);

		let moved = false;
		const handleMouseMove = (moveEvent: MouseEvent) => {
			if (Math.abs(moveEvent.clientY - e.clientY) > 5) {
				moved = true;
				setHasMoved(true);
			}
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			if (!moved) {
				setIsDragging(false);
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					position: "fixed",
					top: `${position * 100}vh`,
					right: isOpen ? `${sideWidth + 20}px` : "0px",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: "12px",
					zIndex: 2147483646,
					cursor: isDragging ? "grabbing" : "grab",
					transition: isDragging ? "none" : "right 0.3s ease",
				}}
			>
				<LibraryFloatingButton isHovered={isHovered} />

				<HanspoonFloatingButton
					isHover={isHovered}
					handleMouseDown={handleButtonDragStart}
					setIsOpen={setIsOpen}
					isDragging={isDragging}
					isOpen={isOpen}
					hasMoved={hasMoved}
				/>
			</div>

			<SidePanel sideWidth={sideWidth} isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
};
