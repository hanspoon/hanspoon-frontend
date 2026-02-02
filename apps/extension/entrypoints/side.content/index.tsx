import { Provider } from "jotai";
import ReactDOM from "react-dom/client";
import { initSupabaseSession } from "@/lib/supabase/supabase";
import { ToastProvider } from "./components/common/Toast";
import { FloatingTab } from "./components/FloatingTab";
import "./style.css";

export default defineContentScript({
	matches: ["*://*/*"],
	cssInjectionMode: "ui",
	async main(ctx) {
		await initSupabaseSession();

		const ui = await createShadowRootUi(ctx, {
			name: "hanspoon-side-panel",
			position: "overlay",
			anchor: "body",
			append: "last",
			onMount: (container) => {
				const wrapper = document.createElement("div");
				container.appendChild(wrapper);

				const root = ReactDOM.createRoot(wrapper);
				root.render(
					<Provider>
						<ToastProvider>
							<FloatingTab />
						</ToastProvider>
					</Provider>,
				);

				return { root, wrapper };
			},
			onRemove: (elements) => {
				elements?.root.unmount();
			},
		});

		ui.mount();
	},
});
