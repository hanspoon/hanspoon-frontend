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
		getStorageConfig()
			.then((loadedConfig) => {
				setConfig(loadedConfig);
				setIsLoaded(true);
			})
			.catch(() => {
				setIsLoaded(true);
			});
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
