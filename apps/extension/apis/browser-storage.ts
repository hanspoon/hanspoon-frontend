import { browser } from "wxt/browser";

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
};
