import ReactDOM from "react-dom/client";
import { HighlightRestorer } from "@/components/toolbar/HighlightRestorer";
import { Toolbar } from "@/components/toolbar/Toolbar";
import "./style.css";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",

	async main(ctx) {
		console.log("HELLO");

		browser.runtime.onMessage.addListener((message) => {
			if (message.type === "HIGHLIGHT_ADDED") {
				window.dispatchEvent(
					new CustomEvent("highlight-sync", {
						detail: { action: "added", ...message.data },
					}),
				);
			} else if (message.type === "HIGHLIGHT_DELETED") {
				window.dispatchEvent(
					new CustomEvent("highlight-sync", {
						detail: { action: "deleted", ...message.data },
					}),
				);
			}
		});

		const ui = await createShadowRootUi(ctx, {
			name: "hanspoon-toolbar",
			position: "inline",
			onMount: (container) => {
				const root = ReactDOM.createRoot(container);
				root.render(
					<>
						<HighlightRestorer />
						<Toolbar />
					</>,
				);
				return root;
			},
		});

		ui.mount();
	},
});
