import { createClient, type Session } from "@supabase/supabase-js";
import {
	getAllHighlightsByPostId,
	getPostById,
	updateHighlightsByPostId,
	updatePost,
} from "@/apis/fetcher";

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
		throw new Error("로그인 세션이 없습니다");
	}

	const { error: sessionError } = await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token,
	});

	if (sessionError) {
		console.error("Supabase 세션 설정 실패:", sessionError);
		return;
	}

	// 포스트
	const post = await getPostById(postId);

	if (!post) {
		console.error("포스트를 찾을 수 없습니다:", postId);
		throw new Error("포스트를 찾을 수 없습니다");
	}

	const { error: postError } = await supabase.from("posts").upsert({
		id: post.id,
		url: post.url,
		title: post.title,
		user_id: session.user.id,
		share_id: post.shareId,
		updated_at: new Date().toISOString(),
	});

	if (postError) {
		console.error("❌ Post 업로드 실패:", postError);
		throw postError;
	}

	// annotation
	const highlights = await getAllHighlightsByPostId(postId);

	const annotationsToUpload = highlights.map((ann) => ({
		id: ann.id,
		post_id: post.id,
		start_meta: ann.start,
		end_meta: ann.end,
		text: ann.text,
		user_id: session.user.id,
		share_id: post.shareId,
		updated_at: new Date().toISOString(),
	}));

	const { error: annError } = await supabase
		.from("annotations")
		.upsert(annotationsToUpload);

	if (annError) throw annError;

	// isSynced 업데이트
	await updateHighlightsByPostId(postId, {
		isSynced: true,
	});

	await updatePost(postId, {
		isSynced: true,
	});
}
