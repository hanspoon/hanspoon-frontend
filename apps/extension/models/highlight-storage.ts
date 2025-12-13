import type { SerializedHighlight } from "../lib/highlight/types";
import { db } from "./db";

export const saveHighlightToDB = async (data: SerializedHighlight) => {
	await db.highlights.add(data);
};

export const removeHighlightFromDB = async (id: string) => {
	await db.highlights.delete(id);
};
