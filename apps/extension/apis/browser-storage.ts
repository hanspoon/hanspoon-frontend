import { browser } from "wxt/browser";

type StorageListener<T> = (newValue: T | undefined, oldValue: T | undefined) => void;

export const storage = {
	get: async function get<T>(key: string): Promise<T | undefined> {
		const result: Record<string, T> = await browser.storage.local.get(key);

		return result[key];
	},
	set: async function set<T>(key: string, value: T): Promise<void> {
		await browser.storage.local.set({
			[key]: value,
		});
	},
	remove: async function remove(key: string): Promise<void> {
		await browser.storage.local.remove(key);
	},
	subscribe: function subscribe<T>(
		key: string,
		listener: StorageListener<T>,
	): () => void {
		const handleChange = (
			changes: Record<string, { oldValue?: T; newValue?: T }>,
		) => {
			if (key in changes) {
				listener(changes[key].newValue, changes[key].oldValue);
			}
		};

		browser.storage.onChanged.addListener(handleChange);
		return () => {
			browser.storage.onChanged.removeListener(handleChange);
		};
	},
};
