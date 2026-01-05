import { expect, test } from "../fixtures/fixtures";
import { getSelectedText, selectTextRe } from "../pages/base";

test.describe("미디엄 요소별 하이라이트 상세 테스트", () => {
	test("일반 텍스트 및 인용문 하이라이트 영역 선택 검증", async ({ page }) => {
		await page.goto(
			"https://medium.com/@gachon2020/test-highlight-extension-verification-for-medium-e43e8b56cdbe",
		);
		const text =
			"This post is designed to test text selection, image exclusion, code block handling, and UI rendering of the browser extension.";
		const regex =
			/This post is designed to test text selection, image exclusion, code block handling, and UI rendering of the browser extension./u;

		const mediumContentLocator = page.locator("article");

		await selectTextRe(mediumContentLocator.getByText(text), regex);

		await page.mouse.up();

		const actualSelectedText = await getSelectedText(page);

		expect(actualSelectedText.trim()).toBe(text);

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);

		await expect(toolbar).toBeVisible();

		const isSelectionRangeValid = await page.evaluate(() => {
			const sel = window.getSelection();
			if (!sel || sel.rangeCount === 0) return false;
			const rect = sel.getRangeAt(0).getBoundingClientRect();
			return rect.width > 0 && rect.height > 0;
		});
		expect(isSelectionRangeValid).toBe(true);
	});
});
