import { saveHighlightToStorage } from "@/store/store";
import { CAMEL_DATASET_IDENTIFIER, DATASET_IDENTIFIER } from "./const";
import { serializeRange } from "./serialization";

function getTextNodesInRange(range: Range) {
	if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
		return range.intersectsNode(range.commonAncestorContainer)
			? [range.commonAncestorContainer]
			: [];
	}

	const textNodes: Node[] = [];
	const walker = document.createTreeWalker(
		range.commonAncestorContainer,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) => {
				return range.intersectsNode(node)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT;
			},
		},
	);

	while (walker.nextNode()) {
		textNodes.push(walker.currentNode);
	}
	return textNodes;
}

export const applyHighlight = (range: Range, savedId?: string) => {
	const textNodes = getTextNodesInRange(range);

	const uniqueId = savedId || `${DATASET_IDENTIFIER}-${Date.now()}`;

	if (!savedId) {
		const serializedData = serializeRange(range, uniqueId, document.body);
		saveHighlightToStorage(serializedData);
	}

	textNodes.forEach((textNode) => {
		const startOffset =
			textNode === range.startContainer ? range.startOffset : 0;
		const endOffset =
			textNode === range.endContainer
				? range.endOffset
				: textNode.textContent?.length || 0;

		const wrapper = document.createElement("span");
		wrapper.style.backgroundColor = "#E9D2FD";
		wrapper.dataset[CAMEL_DATASET_IDENTIFIER] = uniqueId;

		if (endOffset < (textNode.textContent?.length || 0)) {
			(textNode as Text).splitText(endOffset);
		}
		if (startOffset > 0) {
			const targetText = (textNode as Text).splitText(startOffset);
			textNode.parentNode?.insertBefore(wrapper, targetText);
			wrapper.appendChild(targetText);
		} else {
			textNode.parentNode?.insertBefore(wrapper, textNode);
			wrapper.appendChild(textNode);
		}
	});

	window.getSelection()?.removeAllRanges();
};
