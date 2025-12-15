import { useLiveQuery } from "dexie-react-hooks";
import { getAllHighlights } from "@/apis/fetcher";
import { deserializeRange } from "./deserialization";
import { appendHighlightTag } from "./highlight";

export const restoreHighlights = async () => {
	const highlights = useLiveQuery(getAllHighlights);

	if (!highlights) {
		return;
	}

	highlights.forEach((highlight) => {
		try {
			const range = deserializeRange(highlight);
			appendHighlightTag(range, highlight.id);
		} catch (e) {
			console.error(e);
		}
	});
};
