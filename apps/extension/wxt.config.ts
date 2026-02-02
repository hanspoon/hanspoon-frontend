import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

process.setMaxListeners(50);

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	vite: () => ({
		plugins: [tailwindcss()],
		// TODO: Remove any type
		build: {
			minify: "terser",
			terserOptions: {
				compress: {
					drop_console: process.env.NODE_ENV === "production",
					drop_debugger: true,
				},
			} as any,
			chunkSizeWarningLimit: 1000,
		},
	}),
	manifest: {
		permissions: ["storage", "tabs"],
		externally_connectable: {
			ids: ["dclfepbfjokpcpdklodeljlhbmbmcjjb"],
			matches: ["http://localhost:5173/*"],
		},
		host_permissions: ["http://*/*", "https://*/*"],
		web_accessible_resources: [
			{
				resources: ["content-scripts/*.css"],
				matches: ["<all_urls>"],
			},
		],
	},

	// TODO: Remove this before production
	webExt: {
		chromiumArgs: ["--disable-blink-features=AutomationControlled"],
	},
});
