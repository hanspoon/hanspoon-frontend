import type { Locator, Page } from "@playwright/test";

/**
 * Select text range by RegExp.
 *
 * @param locator Element locator
 * @param pattern The pattern to match
 * @param flags RegExp flags
 */
export async function selectTextRe(
	locator: Locator,
	pattern: string | RegExp,
	flags?: string,
): Promise<void> {
	await locator.evaluate(
		(element, { pattern, flags }) => {
			const textNode = element.childNodes[0];
			const match = textNode.textContent?.match(new RegExp(pattern, flags));
			if (match) {
				const range = document.createRange();
				range.setStart(textNode, match.index!);
				range.setEnd(textNode, match.index! + match[0].length);
				const selection = document.getSelection();
				selection?.removeAllRanges();
				selection?.addRange(range);
			}
		},
		{ pattern, flags },
	);
}

export async function getSelectedText(page: Page): Promise<string> {
	return await page.evaluate(() => {
		const selection = document.getSelection();

		return selection?.toString() ?? "";
	});
}
