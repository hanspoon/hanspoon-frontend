import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../models/db";

export const useHighlights = () => {
	const allHighlights = useLiveQuery(() => db.highlights.toArray());

	return allHighlights;
};
