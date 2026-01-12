import { useEffect, useRef } from "react";
import type { HighlightSyncMessage } from "@/entrypoints/background";

export function useSyncMessage(
	types: HighlightSyncMessage["type"][],
	onMessage: (message: HighlightSyncMessage) => void,
) {
	const onMessageRef = useRef(onMessage);

	useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	useEffect(() => {
		const listener = (message: unknown) => {
			if (
				message &&
				typeof message === "object" &&
				"type" in message &&
				typeof message.type === "string" &&
				types.includes(message.type as HighlightSyncMessage["type"])
			) {
				onMessageRef.current(message as HighlightSyncMessage);
			}
		};

		browser.runtime.onMessage.addListener(listener);

		return () => {
			browser.runtime.onMessage.removeListener(listener);
		};
	}, [types]);
}
