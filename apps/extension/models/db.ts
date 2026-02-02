import Dexie, { type Table } from "dexie";
import type {
	LocalAnnotation,
	LocalPost,
	SyncQueueItem,
} from "../lib/highlight/types";

export class AppDB extends Dexie {
	posts!: Table<LocalPost, string>;
	annotations!: Table<LocalAnnotation, string>;
	syncQueue!: Table<SyncQueueItem, string>;

	constructor() {
		super("HanspoonDB");

		this.version(1).stores({
			posts: "id, url, updatedAt, isPublished",
			annotations: "id, postId, shareId",
		});

		this.version(2).stores({
			posts: "id, url, updatedAt, isPublished",
			annotations: "id, postId, shareId",
			syncQueue: "id, postId, status, createdAt",
		});
	}
}

export const db = new AppDB();
