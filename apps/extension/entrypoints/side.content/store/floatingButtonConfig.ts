import { atom } from "jotai";

export interface FloatingButtonConfig {
	enabled: boolean;
	disabledDomains: string[];
}

export const defaultConfig: FloatingButtonConfig = {
	enabled: true,
	disabledDomains: [],
};

export const STORAGE_KEY = "floatingButtonConfig";

export const getStorageConfig = async (): Promise<FloatingButtonConfig> => {
	try {
		console.log("🔍 [FloatingButton] Loading config...");
		if (typeof browser !== "undefined" && browser.storage) {
			console.log("✅ [FloatingButton] Using browser.storage");
			const result = await browser.storage.local.get(STORAGE_KEY);
			const config = result[STORAGE_KEY] || defaultConfig;
			console.log("📦 [FloatingButton] Loaded config:", config);
			return config;
		}
		console.log("⚠️ [FloatingButton] Fallback to localStorage");
		const stored = localStorage.getItem(STORAGE_KEY);
		const config = stored ? JSON.parse(stored) : defaultConfig;
		console.log("📦 [FloatingButton] Loaded config:", config);
		return config;
	} catch (error) {
		console.error("❌ [FloatingButton] Failed to load config:", error);
		return defaultConfig;
	}
};

export const setStorageConfig = async (
	config: FloatingButtonConfig,
): Promise<void> => {
	try {
		console.log("💾 [FloatingButton] Saving config:", config);
		if (typeof browser !== "undefined" && browser.storage) {
			console.log("✅ [FloatingButton] Saving to browser.storage");
			await browser.storage.local.set({ [STORAGE_KEY]: config });
		} else {
			console.log("⚠️ [FloatingButton] Saving to localStorage");
			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
		}
		console.log("✅ [FloatingButton] Config saved successfully");
	} catch (error) {
		console.error("❌ [FloatingButton] Failed to save config:", error);
	}
};

export const floatingButtonConfigAtom = atom<FloatingButtonConfig>(defaultConfig);

export const floatingButtonActionsAtom = atom(
	(get) => get(floatingButtonConfigAtom),
	(get, set, action: { type: string; payload?: string }) => {
		console.log("🚀 [FloatingButton] Action dispatched:", action);
		const currentConfig = get(floatingButtonConfigAtom);
		console.log("📋 [FloatingButton] Current config:", currentConfig);

		let newConfig: FloatingButtonConfig | null = null;

		switch (action.type) {
			case "DISABLE_FOR_SITE": {
				const domain = action.payload || window.location.hostname;
				console.log("🚫 [FloatingButton] Disabling for site:", domain);
				if (!currentConfig.disabledDomains.includes(domain)) {
					newConfig = {
						...currentConfig,
						disabledDomains: [...currentConfig.disabledDomains, domain],
					};
					console.log("📝 [FloatingButton] New config:", newConfig);
				} else {
					console.log("⚠️ [FloatingButton] Domain already disabled:", domain);
				}
				break;
			}
			case "DISABLE_GLOBALLY": {
				console.log("🌍 [FloatingButton] Disabling globally");
				newConfig = {
					...currentConfig,
					enabled: false,
				};
				console.log("📝 [FloatingButton] New config:", newConfig);
				break;
			}
			case "ENABLE_GLOBALLY": {
				console.log("🌍 [FloatingButton] Enabling globally");
				newConfig = {
					...currentConfig,
					enabled: true,
				};
				console.log("📝 [FloatingButton] New config:", newConfig);
				break;
			}
			case "ENABLE_FOR_SITE": {
				const domain = action.payload || window.location.hostname;
				console.log("✅ [FloatingButton] Enabling for site:", domain);
				newConfig = {
					...currentConfig,
					disabledDomains: currentConfig.disabledDomains.filter(
						(d) => d !== domain,
					),
				};
				console.log("📝 [FloatingButton] New config:", newConfig);
				break;
			}
			default:
				console.warn("⚠️ [FloatingButton] Unknown action:", action.type);
				break;
		}

		if (newConfig) {
			set(floatingButtonConfigAtom, newConfig);
			setStorageConfig(newConfig).catch((error) => {
				console.error("❌ [FloatingButton] Failed to persist config:", error);
			});
		}
	},
);

export function matchDomainPattern(
	currentDomain: string,
	pattern: string,
): boolean {
	if (currentDomain === pattern) return true;

	if (pattern.startsWith("*.")) {
		const domainSuffix = pattern.slice(2);
		return (
			currentDomain === domainSuffix ||
			currentDomain.endsWith(`.${domainSuffix}`)
		);
	}

	return currentDomain.endsWith(`.${pattern}`);
}

export function isEnabledForCurrentSite(
	config: FloatingButtonConfig,
): boolean {
	if (!config.enabled) return false;

	const currentDomain = window.location.hostname;
	return !config.disabledDomains.some((domain) =>
		matchDomainPattern(currentDomain, domain),
	);
}
