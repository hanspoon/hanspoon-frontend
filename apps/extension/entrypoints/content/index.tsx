import { Toolbar } from "@/entrypoints/content/components/toolbar/Toolbar";
import "@/lib/metrics/syncMetrics";
import ReactDOM from "react-dom/client";
import { highlightSyncStore } from "@/lib/sync/highlightSyncStore";
import "./style.css";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",

	async main(ctx) {
		highlightSyncStore.initializeForUrl(window.location.href);

		const ui = await createShadowRootUi(ctx, {
			name: "hanspoon-toolbar",
			position: "inline",
			onMount: (container) => {
				const root = ReactDOM.createRoot(container);
				root.render(<Toolbar />);
				return root;
			},
		});

		ui.mount();
	},
});
