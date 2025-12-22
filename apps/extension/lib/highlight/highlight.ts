import { CAMEL_DATASET_IDENTIFIER } from "./const";

function getTextNodesInRange(range: Range) {
	if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
		return range.intersectsNode(range.commonAncestorContainer)
			? [range.commonAncestorContainer as Text]
			: [];
	}

	const textNodes: Text[] = [];
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
		textNodes.push(walker.currentNode as Text);
	}
	return textNodes;
}

export const generateId = () => {
	return crypto.randomUUID();
};

export const appendHighlightTag = (range: Range, savedId: string) => {
	const textNodes = getTextNodesInRange(range);

	textNodes.forEach((textNode) => {
		const startOffset =
			textNode === range.startContainer ? range.startOffset : 0;
		const endOffset =
			textNode === range.endContainer
				? range.endOffset
				: textNode.textContent.length;

		const wrapper = document.createElement("span");
		wrapper.style.backgroundColor = "#E9D2FD";
		wrapper.dataset[CAMEL_DATASET_IDENTIFIER] = savedId;

		if (endOffset < textNode.textContent.length) {
			textNode.splitText(endOffset);
		}
		if (startOffset > 0) {
			const targetText = textNode.splitText(startOffset);
			textNode.parentNode?.insertBefore(wrapper, targetText);
			wrapper.appendChild(targetText);
		} else {
			textNode.parentNode?.insertBefore(wrapper, textNode);
			wrapper.appendChild(textNode);
		}
	});

	window.getSelection()?.removeAllRanges();
};
