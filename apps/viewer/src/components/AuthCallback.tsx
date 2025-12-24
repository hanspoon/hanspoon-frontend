import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const AuthCallback = () => {
	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const checkSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session === null) {
					return;
				}

				chrome.runtime.sendMessage(
					import.meta.env.VITE_EXTENSION_ID,
					{
						type: "LOGIN_SUCCESS" as const,
						payload: session,
					},
					(response: { success: boolean }) => {
						if (response?.success) {
							console.log("익스텐션이 메시지를 잘 받았어요!");
						}
					},
				);
			} catch (error) {
				console.error("인증 확인 중 오류 발생:", error);
			}
		};

		checkSession();
	}, []);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<div>로그인 처리 중...</div>
		</div>
	);
};

export default AuthCallback;
