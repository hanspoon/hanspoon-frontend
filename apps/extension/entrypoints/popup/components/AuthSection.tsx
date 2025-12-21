import { createClient, type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const AuthSection = () => {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		browser.storage.local.get("session").then((res) => {
			if (res.session) setSession(res.session);
		});
	}, []);

	useEffect(() => {
		const handleStorageChange = (changes: {
			[key: string]: Browser.storage.StorageChange;
		}) => {
			if (changes.session) {
				setSession(changes.session.newValue);
			}
		};

		browser.storage.onChanged.addListener(handleStorageChange);
		return () => browser.storage.onChanged.removeListener(handleStorageChange);
	}, []);

	const handleLogin = async () => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
					redirectTo: `http://localhost:5173/auth/callback`,
				},
			});

			if (error) {
				console.error("Google 로그인 오류:", error);
				return;
			}

			if (data.url !== null) {
				browser.tabs.create({ url: data.url });
			}
		} catch (error) {
			console.error("Unexpected crash:", error);
		}
	};

	const handleLogout = async () => {
		await browser.storage.local.remove("session");
		setSession(null);
	};

	if (!session) {
		return (
			<div className="p-4">
				<p>공유 기능을 사용하려면 로그인하세요.</p>
				<button type="button" onClick={handleLogin} className="login-btn">
					구글로 로그인
				</button>
			</div>
		);
	}

	return (
		<div className="p-4">
			<p>반갑습니다, {session.user.user_metadata.full_name}님!</p>
			<button
				type="button"
				onClick={() => {
					console.log("공유하기 버튼 클릭");
				}}
			>
				공유하기 링크 생성
			</button>
			<button
				type="button"
				onClick={handleLogout}
				className="text-gray-400 text-sm underline"
			>
				로그아웃
			</button>
		</div>
	);
};

export default AuthSection;
