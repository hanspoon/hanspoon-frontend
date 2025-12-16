import Dexie, { type Table } from "dexie";
import type { LocalAnnotation, LocalPost } from "../lib/highlight/types";

export class AppDB extends Dexie {
	posts!: Table<LocalPost, string>;
	annotations!: Table<LocalAnnotation, string>;

	constructor() {
		super("HanspoonDB");

		this.version(1).stores({
			posts: "id, url, updatedAt",
			annotations: "id, postId, shareId",
		});
	}
}

export const db = new AppDB();
