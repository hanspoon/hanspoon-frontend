import { useEffect, useRef, useState } from "react";

const TOP_GAP = 30;
const BOTTOM_GAP = 200;
const DRAG_THRESHOLD = 5;

interface UseDragReturn {
	yRatio: number;
	isDragging: boolean;
	hasMoved: boolean;
	handleMouseDown: (e: React.MouseEvent) => void;
}

export const useDrag = (initialYRatio = 0.5): UseDragReturn => {
	const [isDragging, setIsDragging] = useState(false);
	const [hasMoved, setHasMoved] = useState(false);
	const [yRatio, setYRatio] = useState(initialYRatio);

	const startYRef = useRef(0);
	const startPositionRatioRef = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		startYRef.current = e.clientY;
		startPositionRatioRef.current = yRatio;
		setIsDragging(true);
	};

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			const initialY = startPositionRatioRef.current * window.innerHeight;
			const deltaY = e.clientY - startYRef.current;

			const newY = Math.max(
				TOP_GAP,
				Math.min(window.innerHeight - BOTTOM_GAP, initialY + deltaY),
			);

			const newYRatio = newY / window.innerHeight;
			setYRatio(newYRatio);

			if (
				!hasMoved &&
				Math.abs(e.clientY - startYRef.current) > DRAG_THRESHOLD
			) {
				setHasMoved(true);
			}
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
	}, [isDragging, hasMoved]);

	return {
		yRatio,
		isDragging,
		hasMoved,
		handleMouseDown,
	};
};
