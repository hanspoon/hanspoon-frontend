import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	isEnabledForCurrentSite as checkEnabled,
	floatingButtonActionsAtom,
	floatingButtonConfigAtom,
	getStorageConfig,
} from "../store/floatingButtonConfig";

export const useFloatingButtonConfig = () => {
	const [config, setConfig] = useAtom(floatingButtonConfigAtom);
	const [, dispatch] = useAtom(floatingButtonActionsAtom);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		console.log("🔄 [Hook] Loading config from storage...");
		getStorageConfig()
			.then((loadedConfig) => {
				console.log("📥 [Hook] Config loaded:", loadedConfig);
				setConfig(loadedConfig);
				setIsLoaded(true);
			})
			.catch((error) => {
				console.error("❌ [Hook] Failed to load config:", error);
				setIsLoaded(true);
			});
	}, [setConfig]);

	const disableForCurrentSite = () => {
		console.log("🎬 [Hook] disableForCurrentSite called");
		dispatch({ type: "DISABLE_FOR_SITE" });
	};

	const disableGlobally = () => {
		console.log("🎬 [Hook] disableGlobally called");
		dispatch({ type: "DISABLE_GLOBALLY" });
	};

	const enableGlobally = () => {
		console.log("🎬 [Hook] enableGlobally called");
		dispatch({ type: "ENABLE_GLOBALLY" });
	};

	const enableForCurrentSite = () => {
		console.log("🎬 [Hook] enableForCurrentSite called");
		dispatch({ type: "ENABLE_FOR_SITE" });
	};

	const isEnabledForCurrentSite = () => {
		const enabled = checkEnabled(config);
		console.log(
			"🔍 [Hook] isEnabledForCurrentSite:",
			enabled,
			"config:",
			config,
		);
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
