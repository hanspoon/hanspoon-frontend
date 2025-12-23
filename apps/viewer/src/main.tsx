import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import AuthCallback from "./components/AuthCallback.tsx";
import Share from "./pages/SharePage.tsx";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/auth/callback" element={<AuthCallback />} />
						<Route path="/share/:shareId" element={<Share />} />
					</Routes>
				</BrowserRouter>
				<ReactQueryDevtools initialIsOpen={true} />
			</QueryClientProvider>
		</StrictMode>,
	);
}
