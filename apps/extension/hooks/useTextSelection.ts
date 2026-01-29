import { useCallback, useLayoutEffect, useState } from "react";

export type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;

type TextSelectionState = {
	clientRect?: ClientRect;
	isCollapsed?: boolean;
	textContent?: string;
	range?: Range;
};

const defaultState: TextSelectionState = {};

export function useTextSelection(target?: HTMLElement) {
	const [{ clientRect, isCollapsed, textContent, range }, setState] =
		useState<TextSelectionState>(defaultState);

	const handler = useCallback(() => {
		const selection = window.getSelection();

		if (selection == null || !selection.rangeCount) {
			setState(defaultState);
			return;
		}

		const range = selection.getRangeAt(0);

		if (target != null && !target.contains(range.commonAncestorContainer)) {
			setState(defaultState);
			return;
		}

		if (range == null) {
			setState(defaultState);
			return;
		}

		const newTextContent = range.toString();
		let newRect: ClientRect | undefined;

		const rects = range.getClientRects();
		if (rects.length === 0 && range.commonAncestorContainer != null) {
			if (isElement(range.commonAncestorContainer)) {
				newRect = roundValues(
					range.commonAncestorContainer.getBoundingClientRect().toJSON(),
				);
			} else {
				if (rects.length > 0) {
					newRect = roundValues(rects[0].toJSON());
				}
			}
		}

		setState((prevState) => {
			const rectChanged =
				newRect && prevState.clientRect
					? shallowDiff(prevState.clientRect, newRect)
					: newRect !== prevState.clientRect;

			const textChanged = prevState.textContent !== newTextContent;
			const collapsedChanged = prevState.isCollapsed !== range.collapsed;

			if (!rectChanged && !textChanged && !collapsedChanged) {
				return prevState;
			}

			return {
				range,
				clientRect: newRect,
				textContent: newTextContent,
				isCollapsed: range.collapsed,
			};
		});
	}, [target]);

	useLayoutEffect(() => {
		document.addEventListener("selectionchange", handler);
		document.addEventListener("keydown", handler);
		document.addEventListener("keyup", handler);
		window.addEventListener("resize", handler);

		return () => {
			document.removeEventListener("selectionchange", handler);
			document.removeEventListener("keydown", handler);
			document.removeEventListener("keyup", handler);
			window.removeEventListener("resize", handler);
		};
	}, [handler]);

	return {
		clientRect,
		isCollapsed,
		textContent,
		range,
	};
}

function shallowDiff<T extends Record<string, unknown>>(
	prev: T | undefined,
	next: T | undefined,
): boolean {
	if (prev == null || next == null) {
		return prev !== next;
	}
	for (const key of Object.keys(next) as Array<keyof T>) {
		if (prev[key] !== next[key]) {
			return true;
		}
	}
	return false;
}

function roundValues(rect: ClientRect): ClientRect {
	return {
		top: Math.round(rect.top),
		right: Math.round(rect.right),
		bottom: Math.round(rect.bottom),
		left: Math.round(rect.left),
		width: Math.round(rect.width),
		height: Math.round(rect.height),
		x: Math.round(rect.x),
		y: Math.round(rect.y),
	};
}

function isElement(node: Node): node is Element {
	return node.nodeType === Node.ELEMENT_NODE;
}
