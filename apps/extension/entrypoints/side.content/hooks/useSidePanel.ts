import { useEffect, useState } from "react";

interface UseSidePanelReturn {
	isOpen: boolean;
	sideWidth: number;
	setIsOpen: (value: boolean) => void;
}

export const useSidePanel = (initialWidth = 400): UseSidePanelReturn => {
	const [isOpen, setIsOpen] = useState(false);
	const [sideWidth] = useState(initialWidth);

	useEffect(() => {
		const styleId = "side-panel-page-shrink";
		let styleTag = document.getElementById(styleId) as HTMLStyleElement;

		if (isOpen) {
			if (!styleTag) {
				styleTag = document.createElement("style");
				styleTag.id = styleId;
				document.head.appendChild(styleTag);
			}
			styleTag.textContent = `
        html {
          width: calc(100% - ${sideWidth}px) !important;
          position: relative !important;
          min-height: 100vh !important;
        }
      `;
		} else {
			if (styleTag) {
				document.head.removeChild(styleTag);
			}
		}

		return () => {
			if (styleTag && document.head.contains(styleTag)) {
				document.head.removeChild(styleTag);
			}
		};
	}, [isOpen, sideWidth]);

	return {
		isOpen,
		sideWidth,
		setIsOpen,
	};
};
