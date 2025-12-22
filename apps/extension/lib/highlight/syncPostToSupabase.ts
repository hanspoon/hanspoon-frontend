import { createClient, type Session } from "@supabase/supabase-js";
import { db } from "@/models/db";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export async function syncPostToSupabase(
	postId: string,
	session: Session | null,
) {
	if (!session) {
		console.error("로그인 세션이 없습니다! 다시 로그인해주세요.");
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

	const post = await db.posts.get(postId);

	const annotations = await db.annotations
		.where("postId")
		.equals(postId)
		.toArray();

	if (!post) return;

	const { error: postError } = await supabase.from("posts").upsert({
		id: post.id,
		url: post.url,
		title: post.title,
		user_id: session.user.id,
		updated_at: new Date().toISOString(),
	});

	if (postError) {
		console.error("Post 업로드 실패:", postError);
		throw postError;
	}

	const annotationsToUpload = annotations.map((ann) => ({
		id: ann.id,
		post_id: post.id,
		start_meta: ann.start,
		end_meta: ann.end,
		text: ann.text,
		user_id: session.user.id,
	}));

	const { error: annError } = await supabase
		.from("annotations")
		.upsert(annotationsToUpload);

	if (annError) throw annError;

	await db.posts.update(postId, {
		isSynced: true,
		shareId: crypto.randomUUID(),
	});

	await db.annotations
		.where("postId")
		.equals(postId)
		.modify({ isSynced: true });

	const { data: insertedData } = await supabase
		.from("annotations")
		.select("*")
		.eq("post_id", postId);
	console.log("Inserted data:", insertedData);
}
