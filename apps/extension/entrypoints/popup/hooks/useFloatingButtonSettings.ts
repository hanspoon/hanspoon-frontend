import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	type FloatingButtonConfig,
	floatingButtonConfigAtom,
	floatingButtonSettingsAtom,
	getStorageConfig,
	STORAGE_KEY,
} from "../../side.content/store/floatingButtonSettingsAtom";

export const useFloatingButtonSettings = () => {
	const [config, setConfig] = useAtom(floatingButtonConfigAtom);
	const [, dispatch] = useAtom(floatingButtonSettingsAtom);
	const [isLoaded, setIsLoaded] = useState(false);
	const [currentTabDomain, setCurrentTabDomain] = useState<string>("");

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const loadedConfig = await getStorageConfig();
				setConfig(loadedConfig);

				const tabs = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});

				if (tabs[0]?.url) {
					const url = new URL(tabs[0].url);
					setCurrentTabDomain(url.hostname);
				}

				setIsLoaded(true);
			} catch (error) {
				console.error("❌ [Popup] Failed to load initial data:", error);
				setIsLoaded(true);
			}
		};

		loadInitialData();
	}, [setConfig]);

	useEffect(() => {
		const handleStorageChange = (changes: {
			[key: string]: Browser.storage.StorageChange;
		}) => {
			if (changes[STORAGE_KEY]) {
				const newConfig = changes[STORAGE_KEY].newValue as FloatingButtonConfig;
				setConfig(newConfig);
			}
		};

		browser.storage.onChanged.addListener(handleStorageChange);
		return () => browser.storage.onChanged.removeListener(handleStorageChange);
	}, [setConfig]);

	const enableGlobally = () => {
		dispatch({ type: "ENABLE_GLOBALLY" });
	};

	const enableForCurrentSite = () => {
		if (currentTabDomain) {
			dispatch({ type: "ENABLE_FOR_SITE", payload: currentTabDomain });
		}
	};

	const isEnabledGlobally = () => {
		return config.enabled;
	};

	const isEnabledForCurrentSite = () => {
		if (!config.enabled) return false;
		if (!currentTabDomain) return false;

		return !config.disabledDomains.some((domain) =>
			matchDomainPattern(currentTabDomain, domain),
		);
	};

	return {
		config,
		isLoaded,
		currentTabDomain,
		enableGlobally,
		enableForCurrentSite,
		isEnabledGlobally,
		isEnabledForCurrentSite,
	};
};

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
