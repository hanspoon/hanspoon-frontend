import { Provider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { HanspoonPopup } from "./HanspoonPopup";
import "./style.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Provider>
				<HanspoonPopup />
			</Provider>
		</React.StrictMode>,
	);
}
