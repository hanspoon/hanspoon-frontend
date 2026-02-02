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

	await supabase
		.from("posts")
		.upsert({
			id: post.id,
			url: post.url,
			title: post.title,
			user_id: session.user.id,
			share_id: post.shareId,
			updated_at: new Date().toISOString(),
		})
		.throwOnError();

	// 하이라이트
	const highlights = await getAllHighlightsByPostId(postId);

	const highlightsToUpload = highlights.map((highlight) => ({
		id: highlight.id,
		post_id: post.id,
		start_meta: highlight.start,
		end_meta: highlight.end,
		text: highlight.text,
		user_id: session.user.id,
		share_id: post.shareId,
		updated_at: new Date().toISOString(),
	}));

	await supabase.from("annotations").upsert(highlightsToUpload).throwOnError();

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
