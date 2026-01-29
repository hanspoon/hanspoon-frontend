import { useCallback, useLayoutEffect, useState } from "react";

export type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;

type TextSelectionState = {
	clientRect?: ClientRect;
	isCollapsed?: boolean;
	range?: Range;
};

const defaultState: TextSelectionState = {};

export function useSelectionBounds() {
	const [{ clientRect, isCollapsed, range }, setState] =
		useState<TextSelectionState>(defaultState);

	const handler = useCallback(() => {
		const selection = window.getSelection();

		if (selection === null || selection.rangeCount === 0) {
			setState(defaultState);
			return;
		}

		const range = selection.getRangeAt(0);
		const rects = range.getClientRects();

		let newRect: ClientRect;

		if (rects.length > 0) {
			newRect = roundValues(rects[0].toJSON());
		} else if (
			range.commonAncestorContainer !== null &&
			isElement(range.commonAncestorContainer)
		) {
			newRect = roundValues(
				range.commonAncestorContainer.getBoundingClientRect().toJSON(),
			);
		} else {
			return;
		}

		setState((prevState) => {
			let isRectChanged: boolean;

			if (newRect && prevState.clientRect) {
				isRectChanged = shallowDiff(prevState.clientRect, newRect);
			} else {
				isRectChanged = newRect !== prevState.clientRect;
			}

			const isCollapsedChanged = prevState.isCollapsed !== range.collapsed;

			if (!isRectChanged && !isCollapsedChanged) {
				return prevState;
			}

			return {
				range,
				clientRect: newRect,
				isCollapsed: range.collapsed,
			};
		});
	}, []);

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
