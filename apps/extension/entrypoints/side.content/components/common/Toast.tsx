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

	const getToastStyles = (type: ToastType) => {
		const baseStyles = {
			padding: "12px 20px",
			borderRadius: "8px",
			fontSize: "14px",
			fontWeight: "500" as const,
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
			animation: "slideIn 0.3s ease-out",
		};

		switch (type) {
			case "success":
				return {
					...baseStyles,
					backgroundColor: "#10b981",
					color: "white",
				};
			case "error":
				return {
					...baseStyles,
					backgroundColor: "#ef4444",
					color: "white",
				};
			default:
				return {
					...baseStyles,
					backgroundColor: "#3b82f6",
					color: "white",
				};
		}
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
							<div key={toast.id} style={getToastStyles(toast.type)}>
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
