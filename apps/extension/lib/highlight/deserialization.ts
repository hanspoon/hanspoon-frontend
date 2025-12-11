import { ROOT_IDX } from "./const";
import type { DomMeta, SerializedHighlight } from "./types";

const getPointFromMeta = (meta: DomMeta, $root: HTMLElement) => {
	const parents = $root.getElementsByTagName(meta.parentTagName);
	const parent =
		meta.parentIndex === ROOT_IDX ? $root : parents[meta.parentIndex];

	if (!parent) return null;

	const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
	let currentOffset = 0;

	while (walker.nextNode()) {
		const node = walker.currentNode;
		const length = node.textContent?.length || 0;

		if (currentOffset + length >= meta.textOffset) {
			return {
				node: node,
				offset: meta.textOffset - currentOffset,
			};
		}
		currentOffset += length;
	}
	return null;
};

export const deserializeRange = (data: SerializedHighlight): Range | null => {
	const startPoint = getPointFromMeta(data.start, document.body);
	const endPoint = getPointFromMeta(data.end, document.body);

	if (!startPoint || !endPoint) return null;

	const range = document.createRange();
	range.setStart(startPoint.node, startPoint.offset);
	range.setEnd(endPoint.node, endPoint.offset);

	return range;
};
