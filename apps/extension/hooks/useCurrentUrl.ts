import { useEffect, useState } from "react";

export function useCurrentUrl() {
	const [currentUrl, setCurrentUrl] = useState(() => {
		if (typeof window !== "undefined") {
			return window.location.href;
		}
		return "";
	});

	useEffect(() => {
		const handleUrlChange = () => {
			setCurrentUrl(window.location.href);
		};

		window.addEventListener("popstate", handleUrlChange);
		window.addEventListener("locationchange", handleUrlChange);

		return () => {
			window.removeEventListener("popstate", handleUrlChange);
			window.removeEventListener("locationchange", handleUrlChange);
		};
	}, []);

	return currentUrl;
}
