import { createClient } from "@supabase/supabase-js";
import googleLogo from "../../../../public/google.svg";
import { useSession } from "../../hooks/useSession";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const SidePanelFooter = () => {
	const { session, loading: sessionLoading } = useSession();

	const handleLogin = async () => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
					redirectTo: "http://localhost:5173/auth/callback",
				},
			});

			if (error) {
				console.error("Google 로그인 오류:", error);
				return;
			}

			if (data.url !== null) {
				window.open(data.url, "_blank");
			}
		} catch (error) {
			console.error("Unexpected crash:", error);
		}
	};

	return (
		<div style={{ padding: "8px" }}>
			{sessionLoading ? (
				<div style={{ textAlign: "center", color: "#6b7280" }}>로딩 중...</div>
			) : session ? (
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
					}}
				>
					<img
						src={session.user.user_metadata.avatar_url}
						alt="profile"
						width={24}
						height={24}
						style={{
							borderRadius: "50%",
							objectFit: "cover",
						}}
					/>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
					}}
				>
					<button
						type="button"
						onClick={handleLogin}
						style={{
							border: "none",
							background: "none",
						}}
					>
						<img
							src={googleLogo}
							alt="google_logo"
							width={24}
							height={24}
							style={{
								borderRadius: "50%",
								objectFit: "cover",
							}}
						/>
					</button>
				</div>
			)}
		</div>
	);
};
