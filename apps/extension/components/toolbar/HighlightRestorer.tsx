import { useEffect, useState } from "react";
import { getAllHighlightsByPostId, getPostByUrl } from "@/apis/fetcher";
import type { HighlightSyncMessage } from "@/entrypoints/background";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import type { LocalAnnotation } from "@/lib/highlight/types";

export function HighlightRestorer() {
	const [postId, setPostId] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const fetchPostId = async () => {
			const post = await getPostByUrl(window.location.href);
			if (!post) {
				return;
			}

			setPostId(post.id);
			const highlights = await getAllHighlightsByPostId(post.id);
			paintHighlights(highlights);
		};
		fetchPostId();
	}, []);

	useEffect(() => {
		const listener = async (message: unknown) => {
			if (!isHighlightSyncMessage(message)) {
				return;
			}

			if (message.type === "POST_DELETED") {
				if (message.postId === postId) {
					setPostId(null);
					unpaintHighlights();
					return;
				}
			}

			if (message.type === "HIGHLIGHT_CREATED") {
				const highlights = await getAllHighlightsByPostId(message.postId);
				paintHighlights(highlights);
				return;
			}

			if (postId != null && message.type === "HIGHLIGHT_DELETED") {
				const highlights = await getAllHighlightsByPostId(postId);
				unpaintHighlights();
				paintHighlights(highlights);
				return;
			}
		};

		browser.runtime.onMessage.addListener(listener);

		return () => {
			browser.runtime.onMessage.removeListener(listener);
		};
	}, [postId]);

	return null;
}

const isHighlightSyncMessage = (
	message: unknown,
): message is HighlightSyncMessage => {
	if (
		message &&
		typeof message === "object" &&
		"type" in message &&
		typeof message.type === "string" &&
		[
			"HIGHLIGHT_CREATED",
			"HIGHLIGHT_DELETED",
			"POST_CREATED",
			"POST_DELETED",
		].includes(message.type as HighlightSyncMessage["type"])
	) {
		return true;
	}

	return false;
};

const paintHighlights = (highlights: LocalAnnotation[]) => {
	highlights.forEach((data) => {
		let range: Range | null = null;

		try {
			range = deserializeRange(data);
		} catch (error) {
			console.warn(error);
		}

		if (range != null) {
			appendHighlightTag(range, data.id);
		} else {
			console.warn(`복구 실패: ${data.id} (DOM이 변경되었을 수 있음)`);
		}
	});
};

const unpaintHighlights = () => {
	const existingHighlights = document.querySelectorAll("[data-highlight-id]");

	existingHighlights.forEach((el) => {
		const parent = el.parentNode;
		if (parent) {
			const textNode = document.createTextNode(el.textContent || "");
			parent.replaceChild(textNode, el);
			parent.normalize();
		}
	});
};
