import { useTextSelection } from "@/hooks/useTextSelection";
import { CreationModeUI } from "./CreationModeUI";
import { EditModeUI } from "./EditModeUI";

export const Toolbar = () => {
	const { clientRect, isCollapsed, range } = useTextSelection();

	if (clientRect === undefined) {
		return null;
	} else if (!isCollapsed && range !== undefined) {
		return <CreationModeUI targetRect={clientRect} range={range} />;
	} else {
		return <EditModeUI />;
	}
};
