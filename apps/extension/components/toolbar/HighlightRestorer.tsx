import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { getAllHighlightsByPostId, getPostByUrl } from "@/apis/fetcher";
import { useCurrentUrl } from "@/hooks/useCurrentUrl";
import type { HighlightSyncMessage } from "@/lib/broadcast/channel";
import { getBroadcastChannel } from "@/lib/broadcast/channel";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import type { SerializedHighlight } from "@/lib/highlight/types";
import { syncMetrics } from "@/lib/metrics/syncMetrics";

export function HighlightRestorer() {
	const [syncTrigger, setSyncTrigger] = useState(0);
	const [pendingSync, setPendingSync] = useState<HighlightSyncMessage | null>(
		null,
	);
	const [postId, setPostId] = useState<string | null>(null);
	const currentUrl = useCurrentUrl();

	useEffect(() => {
		const fetchPostId = async () => {
			const post = await getPostByUrl(currentUrl);
			setPostId(post?.id || null);
		};
		fetchPostId();
	}, [currentUrl]);

	const allHighlights = useLiveQuery(
		() => (postId ? getAllHighlightsByPostId(postId) : Promise.resolve([])),
		[syncTrigger, postId],
	);

	useEffect(() => {
		const channel = getBroadcastChannel();

		const handleMessage = (message: HighlightSyncMessage) => {
			console.log("📡 BroadcastChannel message received:", message);
			setPendingSync(message);
			setSyncTrigger((prev) => prev + 1);
		};

		channel.onMessage(handleMessage);

		return () => {
		};
	}, []);

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
					pendingSync.type === "HIGHLIGHT_ADDED" ? "added" : "deleted";

				syncMetrics.record(pendingSync.type, latency, action);
				console.log(
					`✅ 동기화 완료: ${pendingSync.type} (${latency.toFixed(2)}ms)`,
				);

				setPendingSync(null);
			}
		} catch (e) {
			console.error("하이라이트 데이터 처리 중 에러 발생", e);
		}
	}, [allHighlights, pendingSync]);

	return null;
}
