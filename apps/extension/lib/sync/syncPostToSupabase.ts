import type { Session } from "@supabase/supabase-js";
import {
	getAllHighlightsByPostId,
	getPostById,
	updateAllHighlightsByPostId,
	updatePost,
} from "@/apis/fetcher";
import { supabase } from "@/lib/supabase/supabase";

export async function syncPostToSupabase(postId: string, session: Session) {
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

	await updateAllHighlightsByPostId({
		postId,
		updates: {
			isSynced: true,
			updatedAt: Date.now(),
		},
	});

	await updatePost({
		postId,
		updates: {
			isSynced: true,
			updatedAt: Date.now(),
		},
	});
}
