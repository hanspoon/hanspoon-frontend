import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { syncPostToSupabase } from "@/lib/highlight/syncPostToSupabase";
import { useCurrentPost } from "../../hooks/useCurrentPost";
import { useSession } from "../../hooks/useSession";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface ShareFloatingButtonInterface {
	isHovered: boolean;
	hasMoved: boolean;
	onClick: () => void;
}

export const ShareFloatingButton = ({
	isHovered,
	hasMoved,
}: ShareFloatingButtonInterface) => {
	const { currentPost } = useCurrentPost();
	const { session } = useSession();
	const [isSharing, setIsSharing] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

	const handleQuickShare = async () => {
		if (hasMoved) return;

		if (!currentPost) {
			showFeedback("먼저 페이지를 하이라이트해주세요!", "warning");
			return;
		}

		if (!session) {
			showFeedback("로그인이 필요합니다", "error");
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
			return;
		}

		setIsSharing(true);
		try {
			await syncPostToSupabase(currentPost.id, session);
			showFeedback("✅ 공유 완료!", "success");
		} catch (error) {
			console.error("공유 실패:", error);
			showFeedback("❌ 공유 실패", "error");
		} finally {
			setIsSharing(false);
		}
	};

	const showFeedback = (
		message: string,
		type: "success" | "error" | "warning",
	) => {
		setFeedbackMessage(message);
		setTimeout(() => setFeedbackMessage(null), 2000);
		console.log(type);
	};

	return (
		<div style={{ position: "relative" }}>
			{feedbackMessage && (
				<div
					style={{
						position: "absolute",
						top: "50%",
						right: "60px",
						transform: "translateY(-50%)",
						padding: "8px 12px",
						backgroundColor: "white",
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						fontSize: "14px",
						fontWeight: "500",
						whiteSpace: "nowrap",
						zIndex: 2147483649,
						animation: "fadeIn 0.2s ease",
					}}
				>
					{feedbackMessage}
				</div>
			)}

			<button
				type="button"
				onClick={handleQuickShare}
				disabled={isSharing}
				style={{
					width: "48px",
					height: "48px",
					borderRadius: "50%",
					backgroundColor: isSharing ? "#d1d5db" : "white",
					border: "none",
					cursor: isSharing ? "wait" : "pointer",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
					fontSize: "20px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					opacity: isHovered ? 1 : 0,
					transform: isHovered ? "translateY(0)" : "translateY(20px)",
					transition: "all 0.3s ease",
					pointerEvents: isHovered ? "auto" : "none",
				}}
				title={
					!currentPost
						? "페이지를 하이라이트해주세요"
						: !session
							? "로그인이 필요합니다"
							: "빠른 공유"
				}
			>
				{isSharing ? "⏳" : "🔗"}
			</button>
		</div>
	);
};
