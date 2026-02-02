import { useEffect, useRef, useState } from "react";

const App = () => {
	return (
		<>
			<main className="h-screen flex flex-col items-center justify-center gap-8">
				<div className="flex flex-col items-center justify-center gap-4">
					<img src="/logo.svg" alt="Hanspoon" className="mx-auto h-20 w-40" />
					<h1 className="text-3xl font-bold">Hanspoon</h1>
					<div className="text-center">
						읽기만 하면 흘러가던 문장에 ‘한 스푼’의 선택을 더해,
						<br />
						기억에 남는 배움으로 만들어봐요.
					</div>
				</div>
				<div>
					<a
						href="https://github.com/hanspoon"
						target="_blank"
						className="cursor-pointer hover:font-bold"
						rel="noopener"
					>
						GitHub
					</a>
				</div>
			</main>
			<CursorFollower />
		</>
	);
};

export default App;

const CursorFollower = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [visible, setVisible] = useState(false);
	const targetRef = useRef({ x: 0, y: 0 });
	const rafRef = useRef<number>(0);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			targetRef.current = { x: e.clientX, y: e.clientY };
			if (!visible) setVisible(true);
		};

		const handleMouseLeave = () => setVisible(false);
		const handleMouseEnter = () => setVisible(true);

		window.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);
		document.addEventListener("mouseenter", handleMouseEnter);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			document.removeEventListener("mouseenter", handleMouseEnter);
		};
	}, [visible]);

	useEffect(() => {
		const animate = () => {
			setPosition((prev) => ({
				x: prev.x + (targetRef.current.x - prev.x) * 0.15,
				y: prev.y + (targetRef.current.y - prev.y) * 0.15,
			}));
			rafRef.current = requestAnimationFrame(animate);
		};

		rafRef.current = requestAnimationFrame(animate);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	if (
		typeof window !== "undefined" &&
		window.matchMedia("(pointer: coarse)").matches
	) {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				left: position.x + 16,
				top: position.y - 8,
				fontSize: "1.5rem",
				pointerEvents: "none",
				zIndex: 9999,
				opacity: visible ? 1 : 0,
				transition: "opacity 0.2s ease",
				userSelect: "none",
			}}
			aria-hidden="true"
		>
			🥄
		</div>
	);
};
