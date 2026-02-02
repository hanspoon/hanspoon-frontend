import type { Session } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

async function setSupabaseSession(session: Session | null) {
	if (!session) {
		await supabase.auth.signOut();
		return;
	}

	const { error } = await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token,
	});

	if (error) {
		console.error("Supabase 세션 설정 실패:", error);
	}
}

export async function initSupabaseSession() {
	const { session } = await browser.storage.local.get<{ session: Session }>(
		"session",
	);

	if (session) {
		await setSupabaseSession(session);
	}

	browser.storage.onChanged.addListener((changes) => {
		if ("session" in changes) {
			setSupabaseSession(changes.session.newValue as Session | null);
		}
	});
}
