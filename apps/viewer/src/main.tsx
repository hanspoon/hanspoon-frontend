import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import App from "./App.tsx";
import AuthCallback from "./components/AuthCallback.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import "./index.css";
import { ProfileEditPage } from "./pages/profile/[id]/edit.tsx";
import { ProfilePage } from "./pages/profile/[id]/index.tsx";
import { SharedPage } from "./pages/SharedPage.tsx";
import SharePage from "./pages/SharePage.tsx";

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

						<Route element={<ProtectedRoute />}>
							<Route path="/edit" element={<ProfileEditPage />} />
						</Route>

						<Route
							element={
								<ProtectedRoute
									condition={(user) => {
										const { username } = useParams<{ username: string }>();
										return user.user_metadata?.name === username;
									}}
								/>
							}
						>
							<Route path="/:username" element={<ProfilePage />} />
						</Route>

						<Route path="/share/:shareId" element={<SharePage />} />
						<Route path="/shared/:shareId" element={<SharedPage />} />
					</Routes>
				</BrowserRouter>
				<ReactQueryDevtools initialIsOpen={true} />
			</QueryClientProvider>
		</StrictMode>,
	);
}
