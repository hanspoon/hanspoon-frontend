import { CAMEL_DATASET_IDENTIFIER } from "./const";
import { camelToKebab } from "../utils/kebab";

export const removeHighlight = (id: string) => {
	const attributeName = `data-${camelToKebab(CAMEL_DATASET_IDENTIFIER)}`;

	const wrappers = document.querySelectorAll(`[${attributeName}="${id}"]`);

	if (wrappers.length === 0) {
		console.warn(
			`삭제할 요소를 DOM에서 찾지 못했습니다. ID: ${id}, Attr: ${attributeName}`,
		);
		return;
	}

	wrappers.forEach((wrapper) => {
		const parent = wrapper.parentNode;
		if (!parent) return;

		while (wrapper.firstChild) {
			parent.insertBefore(wrapper.firstChild, wrapper);
		}

		parent.removeChild(wrapper);

		parent.normalize();
	});

	window.getSelection()?.removeAllRanges();
};
