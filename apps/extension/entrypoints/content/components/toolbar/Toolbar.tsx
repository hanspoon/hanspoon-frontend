import { useFloatingButtonStatus } from "../../hooks/useFloatingButtonStatus";
import { useSelectionBounds } from "../../hooks/useSelectionBounds";
import { CreationModeUI } from "./CreationModeUI";
import { EditModeUI } from "./EditModeUI";

export const Toolbar = () => {
	const { clientRect, isCollapsed, range } = useSelectionBounds();
	const { isEnabledForCurrentSite } = useFloatingButtonStatus();

	const enabled = isEnabledForCurrentSite();

	if (!enabled) {
		return null;
	}

	if (clientRect === undefined) {
		return null;
	} else if (!isCollapsed && range !== undefined) {
		return <CreationModeUI targetRect={clientRect} range={range} />;
	} else {
		return <EditModeUI />;
	}
};
