import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { getAllHighlights } from "@/apis/fetcher";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import { removeHighlight } from "@/lib/highlight/remove";
import type { SerializedHighlight } from "@/lib/highlight/types";

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
			}>;
			const { action, highlightId } = customEvent.detail;

			if (action === "added") {
				const highlights = await getAllHighlights();
				const newHighlight = highlights?.find((h) => h.id === highlightId);

				if (newHighlight) {
					try {
						const range = deserializeRange(newHighlight);
						if (range) {
							appendHighlightTag(range, newHighlight.id);
						}
					} catch (e) {
						console.error("하이라이트 추가 실패:", e);
					}
				}
			} else if (action === "deleted") {
				removeHighlight(highlightId);
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
