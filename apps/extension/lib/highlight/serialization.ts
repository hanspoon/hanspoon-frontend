import { CAMEL_DATASET_IDENTIFIER, ROOT_IDX, UNKNOWN_IDX } from "./const";
import type { DomMeta, SerializedHighlight } from "./types";

const countGlobalNodeIndex = (
	$node: HTMLElement,
	$root: HTMLElement,
): number => {
	const tagName = $node.tagName;
	const $list = $root.getElementsByTagName(tagName);

	for (let i = 0; i < $list.length; i++) {
		if ($node === $list[i]) {
			return i;
		}
	}
	return UNKNOWN_IDX;
};

const getTextPreOffset = ($root: Node, $text: Node): number => {
	if (!$root || !$text) return UNKNOWN_IDX;

	const stack: Node[] = [$root];
	let offset = 0;
	let found = false;

	while (stack.length > 0) {
		const node = stack.pop();
		if (!node) continue;

		if (node === $text) {
			found = true;
			break;
		}

		if (node.nodeType === Node.TEXT_NODE) {
			offset += node.textContent?.length || 0;
			continue;
		}

		const children = node.childNodes;
		for (let i = children.length - 1; i >= 0; i--) {
			stack.push(children[i]);
		}
	}

	return found ? offset : UNKNOWN_IDX;
};

const getOriginParent = ($node: Node): HTMLElement => {
	let $originParent = $node.parentNode as HTMLElement;

	while (
		$originParent instanceof HTMLElement &&
		$originParent.dataset[CAMEL_DATASET_IDENTIFIER]
	) {
		$originParent = $originParent.parentNode as HTMLElement;
	}

	return $originParent;
};

const getDomMeta = (
	$node: Node,
	offset: number,
	$root: HTMLElement,
): DomMeta => {
	const $originParent = getOriginParent($node);

	const index =
		$originParent === $root
			? ROOT_IDX
			: countGlobalNodeIndex($originParent, $root);

	const preNodeOffset = getTextPreOffset($originParent, $node);

	return {
		parentTagName: $originParent.tagName,
		parentIndex: index,
		textOffset: preNodeOffset + offset,
	};
};

export const serializeRange = (
	range: Range,
	id: string,
	$root: HTMLElement = document.body,
): SerializedHighlight => {
	const startMeta = getDomMeta(range.startContainer, range.startOffset, $root);
	const endMeta = getDomMeta(range.endContainer, range.endOffset, $root);

	return {
		id,
		start: startMeta,
		end: endMeta,
		text: range.toString(),
	};
};
