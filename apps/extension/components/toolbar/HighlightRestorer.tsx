import { useEffect, useState } from "react";
import { getAllHighlightsByPostId, getPostByUrl } from "@/apis/fetcher";
import type { HighlightSyncMessage } from "@/entrypoints/background";
import { useCurrentUrl } from "@/hooks/useCurrentUrl";
import { useSyncMessage } from "@/hooks/useSyncMessage";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import type {
	LocalAnnotation,
	SerializedHighlight,
} from "@/lib/highlight/types";

export function HighlightRestorer() {
	const [pendingSync, setPendingSync] = useState<HighlightSyncMessage | null>(
		null,
	);

	const [postId, setPostId] = useState<string | null>(null);
	const [allHighlights, setAllHighlights] = useState<LocalAnnotation[]>([]);
	const currentUrl = useCurrentUrl();

	// postId
	useEffect(() => {
		const fetchPostId = async () => {
			const post = await getPostByUrl(currentUrl);
			setPostId(post?.id || null);
		};
		fetchPostId();
	}, [currentUrl]);

	// allHighlights at initial render
	useEffect(() => {
		const fetchHighlights = async () => {
			if (!postId) {
				setAllHighlights([]);
				return;
			}
			const highlights = await getAllHighlightsByPostId(postId);
			setAllHighlights(highlights || []);
		};
		fetchHighlights();
	}, [postId]);

	useSyncMessage(
		["HIGHLIGHT_CREATED", "HIGHLIGHT_DELETED", "POST_CREATED", "POST_DELETED"],
		async (message: HighlightSyncMessage) => {
			console.log({ message });
			if (message.type === "POST_CREATED") {
				const post = await getPostByUrl(currentUrl);
				if (post) {
					setPostId(post.id);
				}
				setPendingSync(message);

				return;
			}

			if (message.type === "POST_DELETED") {
				if (message.postId === postId) {
					setAllHighlights([]);
					setPostId(null);

					const existingHighlights = document.querySelectorAll(
						"[data-highlight-id]",
					);

					existingHighlights.forEach((el) => {
						const parent = el.parentNode;
						if (parent) {
							const textNode = document.createTextNode(el.textContent || "");
							parent.replaceChild(textNode, el);
							parent.normalize();
						}
					});

					return;
				}
			}

			if (
				postId != null &&
				(message.type === "HIGHLIGHT_CREATED" ||
					message.type === "HIGHLIGHT_DELETED")
			) {
				setAllHighlights(await getAllHighlightsByPostId(postId));
			}

			setPendingSync(message);
		},
	);

	useEffect(() => {
		if (!allHighlights || allHighlights.length === 0) return;

		const existingHighlights = document.querySelectorAll("[data-highlight-id]");
		existingHighlights.forEach((el) => {
			const parent = el.parentNode;
			if (parent) {
				const textNode = document.createTextNode(el.textContent || "");
				parent.replaceChild(textNode, el);
				parent.normalize();
			}
		});

		try {
			allHighlights.forEach((data: SerializedHighlight) => {
				const range = deserializeRange(data);
				if (range) {
					appendHighlightTag(range, data.id);
				} else {
					console.warn(`복구 실패: ${data.id} (DOM이 변경되었을 수 있음)`);
				}
			});

			if (pendingSync) {
				const endTime = performance.timeOrigin + performance.now();
				const latency = endTime - pendingSync.timestamp;
				const action =
					pendingSync.type === "HIGHLIGHT_CREATED" ? "added" : "deleted";

				console.log(
					`✅ 동기화 완료: ${pendingSync.type} ${action} (${latency.toFixed(2)}ms)`,
				);

				setPendingSync(null);
			}
		} catch (e) {
			console.error("하이라이트 데이터 처리 중 에러 발생", e);
		}
	}, [allHighlights, pendingSync]);

	return null;
}
