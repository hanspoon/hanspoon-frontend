import { atom } from "jotai";

export interface FloatingButtonConfig {
	enabled: boolean;
	disabledDomains: string[];
}

export const defaultConfig: FloatingButtonConfig = {
	enabled: true,
	disabledDomains: [],
};

type FloatingButtonAction =
	| { type: "DISABLE_FOR_SITE"; payload?: string }
	| { type: "DISABLE_GLOBALLY" }
	| { type: "ENABLE_GLOBALLY" }
	| { type: "ENABLE_FOR_SITE"; payload?: string };

export const STORAGE_KEY = "floatingButtonConfig";

export const getStorageConfig = async (): Promise<FloatingButtonConfig> => {
	try {
		if (typeof browser !== "undefined" && browser.storage) {
			const result = await browser.storage.local.get(STORAGE_KEY);
			const config = result[STORAGE_KEY] || defaultConfig;
			return config;
		}
		const stored = localStorage.getItem(STORAGE_KEY);
		const config = stored ? JSON.parse(stored) : defaultConfig;
		return config;
	} catch (error) {
		console.warn(error);
		return defaultConfig;
	}
};

export const setStorageConfig = async (
	config: FloatingButtonConfig,
): Promise<void> => {
	try {
		if (typeof browser !== "undefined" && browser.storage) {
			await browser.storage.local.set({ [STORAGE_KEY]: config });
		} else {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
		}
	} catch (error) {
		console.warn(error);
	}
};

export const floatingButtonConfigAtom =
	atom<FloatingButtonConfig>(defaultConfig);

export const floatingButtonActionsAtom = atom(
	(get) => get(floatingButtonConfigAtom),
	(get, set, action: FloatingButtonAction) => {
		const currentConfig = get(floatingButtonConfigAtom);

		let newConfig: FloatingButtonConfig | null = null;

		switch (action.type) {
			case "DISABLE_FOR_SITE": {
				const domain = action.payload || window.location.hostname;
				if (!currentConfig.disabledDomains.includes(domain)) {
					newConfig = {
						...currentConfig,
						disabledDomains: [...currentConfig.disabledDomains, domain],
					};
				}
				break;
			}
			case "DISABLE_GLOBALLY": {
				newConfig = {
					...currentConfig,
					enabled: false,
				};
				break;
			}
			case "ENABLE_GLOBALLY": {
				newConfig = {
					...currentConfig,
					enabled: true,
				};
				break;
			}
			case "ENABLE_FOR_SITE": {
				const domain = action.payload || window.location.hostname;
				newConfig = {
					...currentConfig,
					disabledDomains: currentConfig.disabledDomains.filter(
						(d) => d !== domain,
					),
				};
				break;
			}
			default:
				console.warn("⚠️ [FloatingButton] Unknown action:", action);
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

function matchDomainPattern(currentDomain: string, pattern: string): boolean {
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

export function isEnabledForCurrentSite(config: FloatingButtonConfig): boolean {
	if (!config.enabled) return false;

	const currentDomain = window.location.hostname;
	return !config.disabledDomains.some((domain) =>
		matchDomainPattern(currentDomain, domain),
	);
}
