import ReactDOM from "react-dom/client";
import { HighlightRestorer } from "@/components/toolbar/HighlightRestorer";
import { Toolbar } from "@/components/toolbar/Toolbar";
import "./style.css";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",

	async main(ctx) {
		console.log("HELLO");

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
