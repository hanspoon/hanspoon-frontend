import { useEffect, useState } from "react";
import { getAllHighlights } from "@/apis/fetcher";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import { removeHighlight } from "@/lib/highlight/remove";
import type { LocalAnnotation } from "@/lib/highlight/types";
import { onHighlightChange } from "@/lib/metrics/syncMetrics";

export function HighlightRestorer() {
	const [highlights, setHighlights] = useState<LocalAnnotation[]>([]);

	useEffect(() => {
		const loadHighlights = async () => {
			const data = await getAllHighlights();
			if (data) {
				setHighlights(data);
			}
		};
		loadHighlights();
	}, []);

	useEffect(() => {
		if (!highlights || highlights.length === 0) return;

		try {
			highlights.forEach((data) => {
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
	}, [highlights]);

	useEffect(() => {
		const unsubscribe = onHighlightChange(async (signal) => {
			console.log("📡 chrome.storage message received:", {
				type: signal.action,
				id: signal.id,
				postId: signal.postId,
				timestamp: signal.timestamp,
			});

			const startTime = performance.now();

			if (signal.action === "HIGHLIGHT_ADDED") {
				const data = await getAllHighlights();
				if (data) {
					setHighlights(data);
				}
			} else if (signal.action === "HIGHLIGHT_DELETED") {
				removeHighlight(signal.id);
				setHighlights((prev) => prev.filter((h) => h.id !== signal.id));
			}

			const syncLatency = performance.now() - startTime;
			console.log(`✅ 동기화 완료: ${signal.id} (${syncLatency.toFixed(2)}ms)`);
		});

		return unsubscribe;
	}, []);

	return null;
}
