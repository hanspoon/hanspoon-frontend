import posthog from "posthog-js";

let isInitialized = false;

export const initPostHog = () => {
	if (isInitialized) return;

	const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;

	if (!apiKey) {
		console.warn("[PostHog] API key not found. Analytics disabled.");
		return;
	}

	posthog.init(apiKey, {
		api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
		persistence: "localStorage",
		autocapture: false,
		capture_pageview: false,
		disable_session_recording: true,
	});

	isInitialized = true;
};

export const trackEvent = (
	eventName: string,
	properties?: Record<string, unknown>,
) => {
	if (!isInitialized) return;

	posthog.capture(eventName, {
		...properties,
		url: window.location.href,
		hostname: window.location.hostname,
	});
};

export const identifyUser = (userId: string) => {
	if (!isInitialized) return;

	posthog.identify(userId);
};

export { posthog };
