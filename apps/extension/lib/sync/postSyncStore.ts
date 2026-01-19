import { getAllPosts } from "@/apis/fetcher";
import type { HighlightSyncMessage } from "@/entrypoints/background";
import type { LocalPost } from "@/lib/highlight/types";

type Listener = () => void;

interface PostSyncState {
	posts: LocalPost[];
	lastSyncTimestamp: number;
}

class PostSyncStore {
	private state: PostSyncState = {
		posts: [],
		lastSyncTimestamp: 0,
	};

	private listeners = new Set<Listener>();
	private isListenerRegistered = false;

	constructor() {
		this.registerGlobalListener();
	}

	private registerGlobalListener() {
		if (this.isListenerRegistered) return;

		browser.runtime.onMessage.addListener(this.handleMessage);
		this.isListenerRegistered = true;
	}

	private handleMessage = async (message: unknown) => {
		if (!this.isHighlightSyncMessage(message)) {
			return;
		}

		if (message.type === "POST_CREATED" || message.type === "POST_DELETED") {
			await this.refreshPosts();
		}
	};

	private isHighlightSyncMessage(
		message: unknown,
	): message is HighlightSyncMessage {
		return (
			message !== null &&
			typeof message === "object" &&
			"type" in message &&
			typeof (message as { type: unknown }).type === "string" &&
			[
				"HIGHLIGHT_CREATED",
				"HIGHLIGHT_DELETED",
				"POST_CREATED",
				"POST_DELETED",
				"All_HIGHLIGHTS_DELETED",
			].includes((message as HighlightSyncMessage).type)
		);
	}

	private async refreshPosts() {
		try {
			const posts = await getAllPosts();
			this.state = {
				posts,
				lastSyncTimestamp: Date.now(),
			};
			this.notifyListeners();
		} catch (error) {
			console.error("[PostSyncStore] Failed to refresh:", error);
		}
	}

	private notifyListeners() {
		for (const listener of this.listeners) {
			listener();
		}
	}

	// Public API
	async initialize() {
		await this.refreshPosts();
	}

	// useSyncExternalStore API
	subscribe = (listener: Listener): (() => void) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	getSnapshot = (): PostSyncState => {
		return this.state;
	};
}

export const postSyncStore = new PostSyncStore();
