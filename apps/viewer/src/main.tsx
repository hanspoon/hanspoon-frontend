import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import AuthCallback from "./components/AuthCallback.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/auth/callback" element={<AuthCallback />} />
				</Routes>
			</BrowserRouter>
		</StrictMode>,
	);
}
