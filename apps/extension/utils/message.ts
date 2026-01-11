import { defineExtensionMessaging } from "@webext-core/messaging";
import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "@/lib/highlight/types";

export interface DBProtocolMap {
	DB_SAVE_HIGHLIGHT: (data: { data: SerializedHighlight; postId: string }) => {
		success: boolean;
	};
	DB_DELETE_HIGHLIGHT: (data: { id: string }) => { success: boolean };
	DB_GET_ALL_HIGHLIGHTS: () => LocalAnnotation[];
	DB_GET_ALL_HIGHLIGHTS_BY_ID: (data: { postId: string }) => LocalAnnotation[];
	DB_GET_ALL_POSTS: () => LocalPost[];
	DB_GET_POST_BY_ID: (data: { postId: string }) => LocalPost | undefined;
	DB_GET_POST_BY_URL: (data: { url: string }) => LocalPost | undefined;
	DB_ADD_POST: (data: { postData: LocalPost }) => { success: boolean };
	DB_UPDATE_POST: (data: { postId: string; updates: Partial<LocalPost> }) => {
		success: boolean;
	};
	DB_DELETE_POST: (data: { postId: string }) => { success: boolean };
	DB_DELETE_ANNOTATIONS_BY_POST_ID: (data: { postId: string }) => {
		success: boolean;
	};
	DB_UPDATE_ANNOTATIONS_BY_POST_ID: (data: { postId: string; updates: Partial<LocalAnnotation> }) => {
		success: boolean;
	};
}

export const { sendMessage, onMessage } =
	defineExtensionMessaging<DBProtocolMap>();
