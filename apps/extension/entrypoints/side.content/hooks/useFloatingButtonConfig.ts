import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	isEnabledForCurrentSite as checkEnabled,
	type FloatingButtonConfig,
	floatingButtonActionsAtom,
	floatingButtonConfigAtom,
	getStorageConfig,
	STORAGE_KEY,
} from "../store/floatingButtonConfig";

export const useFloatingButtonConfig = () => {
	const [config, setConfig] = useAtom(floatingButtonConfigAtom);
	const [, dispatch] = useAtom(floatingButtonActionsAtom);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		getStorageConfig()
			.then((loadedConfig) => {
				setConfig(loadedConfig);
				setIsLoaded(true);
			})
			.catch(() => {
				setIsLoaded(true);
			});
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

	const disableForCurrentSite = () => {
		dispatch({ type: "DISABLE_FOR_SITE" });
	};

	const disableGlobally = () => {
		dispatch({ type: "DISABLE_GLOBALLY" });
	};

	const enableGlobally = () => {
		dispatch({ type: "ENABLE_GLOBALLY" });
	};

	const enableForCurrentSite = () => {
		dispatch({ type: "ENABLE_FOR_SITE" });
	};

	const isEnabledForCurrentSite = () => {
		const enabled = checkEnabled(config);
		return enabled;
	};

	return {
		config,
		isLoaded,
		disableForCurrentSite,
		disableGlobally,
		enableGlobally,
		enableForCurrentSite,
		isEnabledForCurrentSite,
	};
};
