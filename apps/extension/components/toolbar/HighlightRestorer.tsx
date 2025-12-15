import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { getAllHighlights } from "@/apis/fetcher";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
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

	return null;
}
