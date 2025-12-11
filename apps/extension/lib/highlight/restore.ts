import { STORAGE_KEY } from "@/store/store";
import { deserializeRange } from "./deserialization";
import { applyHighlight } from "./highlight";
import type { SerializedHighlight } from "./types";

export const restoreHighlights = () => {
	const dataString = localStorage.getItem(STORAGE_KEY);
	if (!dataString) return;

	try {
		const savedHighlights: SerializedHighlight[] = JSON.parse(dataString);

		savedHighlights.forEach((data) => {
			const range = deserializeRange(data);

			if (range) {
				applyHighlight(range, data.id);
			} else {
				console.warn(`복구 실패: ${data.id} (DOM이 변경되었을 수 있음)`);
			}
		});
	} catch (e) {
		console.error("하이라이트 데이터 파싱 에러", e);
	}
};
