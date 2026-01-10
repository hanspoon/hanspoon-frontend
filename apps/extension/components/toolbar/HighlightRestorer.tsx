import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { getAllHighlights } from "@/apis/fetcher";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import { removeHighlight } from "@/lib/highlight/remove";
import type { SerializedHighlight } from "@/lib/highlight/types";
import { syncMetrics } from "@/lib/performance/syncMetrics";

export function HighlightRestorer() {
	const allHighlights = useLiveQuery(getAllHighlights);

	useEffect(() => {
		if (!allHighlights || allHighlights.length === 0) return;

		try {
			allHighlights.forEach((data: SerializedHighlight) => {
				const range = deserializeRange(data);
				if (range) {
					appendHighlightTag(range, data.id);
				} else {
					console.warn(`복구 실패: ${data.id} (DOM이 변경되었을 수 있음)`);
				}
			});
		} catch (e) {
			console.error("하이라이트 데이터 처리 중 에러 발생", e);
		}
	}, [allHighlights]);

	useEffect(() => {
		const handleHighlightSync = async (event: Event) => {
			const customEvent = event as CustomEvent<{
				action: string;
				highlightId: string;
				postId?: string;
				timestamp?: number;
			}>;
			const { action, highlightId, timestamp } = customEvent.detail;

			if (action === "added") {
				const highlights = await getAllHighlights();
				const newHighlight = highlights?.find((h) => h.id === highlightId);

				if (newHighlight) {
					try {
						const range = deserializeRange(newHighlight);
						if (range) {
							appendHighlightTag(range, newHighlight.id);

							if (timestamp !== undefined) {
								const endTime = performance.timeOrigin + performance.now();
								const latency = endTime - timestamp;
								syncMetrics.record(highlightId, latency, "added");
								console.log(
									`✅ 동기화 완료: ${highlightId} (${latency.toFixed(2)}ms)`,
								);
							}
						}
					} catch (e) {
						console.error("하이라이트 추가 실패:", e);
					}
				}
			} else if (action === "deleted") {
				removeHighlight(highlightId);

				if (timestamp !== undefined) {
					const endTime = performance.timeOrigin + performance.now();
					const latency = endTime - timestamp;
					syncMetrics.record(highlightId, latency, "deleted");
					console.log(
						`✅ 동기화 완료 (삭제): ${highlightId} (${latency.toFixed(2)}ms)`,
					);
				}
			}
		};

		window.addEventListener(
			"highlight-sync",
			handleHighlightSync as EventListener,
		);

		return () => {
			window.removeEventListener(
				"highlight-sync",
				handleHighlightSync as EventListener,
			);
		};
	}, []);

	return null;
}
