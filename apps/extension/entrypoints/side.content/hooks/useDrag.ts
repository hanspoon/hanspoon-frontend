import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD = 5;

interface UseDragProps {
	initialY: number;
	onClick: () => void;
}

export const useDrag = ({ initialY, onClick }: UseDragProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [y, setY] = useState(initialY);

	const elementRef = useRef<HTMLDivElement>(null);
	const mousePositionRef = useRef<number | null>(null);
	const offset = useRef<number | null>(null);
	const startY = useRef<number | null>(null);
	const hasDragged = useRef(false);

	const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (elementRef.current === null) {
			return;
		}

		mousePositionRef.current = e.clientY;
		startY.current = e.clientY;
		offset.current =
			mousePositionRef.current - elementRef.current.getBoundingClientRect().top;
	};

	const handleClick = () => {
		if (!hasDragged.current) {
			onClick?.();
		}
	};

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

			if (hasDragged.current) {
				const newY = mousePositionRef.current - offset.current;
				setY(newY);
			}
		};

		const handleMouseUp = () => {
			mousePositionRef.current = null;
			offset.current = null;
			startY.current = null;
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

	return { elementRef, handleMouseDown, handleClick, isDragging, y };
};
