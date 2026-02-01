import type { Session } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export async function initSupabaseSession() {
	const { session } = await browser.storage.local.get<{ session: Session }>(
		"session",
	);

	if (!session) {
		console.error("로그인 세션이 없습니다.");
		return;
	}

	const { error: sessionError } = await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token,
	});

	if (sessionError) {
		console.error("Supabase 세션 설정 실패:", sessionError);
		return;
	}
}
