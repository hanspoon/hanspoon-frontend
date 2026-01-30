type UUID = string;

export interface DomMeta {
	parentTagName: string;
	parentIndex: number;
	textOffset: number;
}

export interface SerializedHighlight {
	id: UUID;
	start: DomMeta;
	end: DomMeta;
	text: string;
}
export interface LocalAnnotation {
	id: UUID;
	postId: UUID;

	start: DomMeta;
	end: DomMeta;
	text: string;

	createdAt: number;
	updatedAt: number;
	shareId: string | null;
	isSynced: boolean;
}

export interface LocalPost {
	id: UUID;
	url: string;

	title: string;
	favIconUrl: string;
	sourceDomain: string;

	createdAt: number;
	updatedAt: number;
	plainText: string;
	shareId: string | null;
	isSynced: boolean;
	isPublished: boolean;
}

export interface SyncQueueItem {
	id: UUID;
	postId: UUID;
	action: "upsert" | "delete";
	status: "pending" | "processing" | "failed";
	retryCount: number;
	createdAt: number;
	lastAttempt?: number;
	error?: string;
}
