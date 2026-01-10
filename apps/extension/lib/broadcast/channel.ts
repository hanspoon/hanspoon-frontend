export const CHANNEL_NAME = "hanspoon-highlights";

export type HighlightSyncMessage =
	| { type: "HIGHLIGHT_ADDED"; id: string; postId: string }
	| { type: "HIGHLIGHT_DELETED"; id: string };

class HighlightBroadcastChannel {
	private channel: BroadcastChannel;

	constructor() {
		this.channel = new BroadcastChannel(CHANNEL_NAME);
	}

	postMessage(message: HighlightSyncMessage) {
		this.channel.postMessage(message);
	}

	onMessage(callback: (message: HighlightSyncMessage) => void) {
		this.channel.onmessage = (event: MessageEvent<HighlightSyncMessage>) => {
			callback(event.data);
		};
	}

	close() {
		this.channel.close();
	}
}

let broadcastChannel: HighlightBroadcastChannel | null = null;

export const getBroadcastChannel = (): HighlightBroadcastChannel => {
	if (!broadcastChannel) {
		broadcastChannel = new HighlightBroadcastChannel();
	}
	return broadcastChannel;
};
