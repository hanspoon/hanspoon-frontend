import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
};

interface ToastProviderProps {
	children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType = "info") => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	}, []);

	const getIcon = (type: ToastType) => {
		switch (type) {
			case "success":
				return (
					<svg
						role="img"
						aria-label="Check"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
				);
			case "error":
				return (
					<svg
						role="img"
						aria-label="Error"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
						/>
					</svg>
				);
			default:
				return (
					<svg
						role="img"
						aria-label="Info"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
						/>
					</svg>
				);
		}
	};

	const toastStyles = {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		padding: "12px 16px",
		borderRadius: "10px",
		fontSize: "13px",
		fontWeight: "500" as const,
		backgroundColor: "rgba(24, 24, 27, 0.95)",
		color: "#fafafa",
		boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12)",
		animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
		backdropFilter: "blur(8px)",
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{createPortal(
				<>
					<style>
						{`
							@keyframes slideIn {
								from {
									transform: translateX(100%);
									opacity: 0;
								}
								to {
									transform: translateX(0);
									opacity: 1;
								}
							}
						`}
					</style>
					<div
						style={{
							position: "fixed",
							bottom: "20px",
							right: "20px",
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							zIndex: 2147483649,
						}}
					>
						{toasts.map((toast) => (
							<div key={toast.id} style={toastStyles}>
								<div style={{ width: "24px" }}>{getIcon(toast.type)}</div>
								{toast.message}
							</div>
						))}
					</div>
				</>,
				document.body,
			)}
		</ToastContext.Provider>
	);
};
