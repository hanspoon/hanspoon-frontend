import ReactDOM from "react-dom/client";
import { Toolbar } from "@/entrypoints/content/components/toolbar/Toolbar";
import { initPostHog } from "@/lib/analytics/posthog";
import { highlightSyncStore } from "@/lib/sync/highlightSyncStore";
import "./style.css";
import { Provider } from "jotai";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",

	async main(ctx) {
		initPostHog();
		highlightSyncStore.initializeForUrl(window.location.href);

		const ui = await createShadowRootUi(ctx, {
			name: "hanspoon-toolbar",
			position: "inline",
			onMount: (container) => {
				const root = ReactDOM.createRoot(container);
				root.render(
					<Provider>
						<Toolbar />
					</Provider>,
				);
				return root;
			},
		});

		ui.mount();
	},
});
