import { useEffect, useState } from "react";
import { CAMEL_DATASET_IDENTIFIER } from "@/lib/highlight/const";

export const useHighlightSelection = () => {
	const [clickedHighlight, setClickedHighlight] = useState<{
		id: string;
		rect: DOMRect;
	} | null>(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const highlightId = target.dataset?.[CAMEL_DATASET_IDENTIFIER];

			if (highlightId) {
				const rect = target.getBoundingClientRect();
				setClickedHighlight({ id: highlightId, rect });
			} else {
				setClickedHighlight(null);
			}
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);

	const clearHighlightSelection = () => setClickedHighlight(null);

	return {
		clickedHighlight,
		setClickedHighlight,
		clearHighlightSelection,
	};
};
