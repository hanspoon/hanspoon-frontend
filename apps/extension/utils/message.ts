import { defineExtensionMessaging } from "@webext-core/messaging";
import type {
	LocalAnnotation,
	LocalPost,
	SerializedHighlight,
} from "@/lib/highlight/types";

export interface DBProtocolMap {
	// 하이라이트
	DB_CREATE_HIGHLIGHT: (data: {
		data: SerializedHighlight;
		postId: string;
	}) => {
		success: boolean;
	};
	DB_UPDATE_ALL_HIGHLIGHTS_BY_POST_ID: (data: {
		postId: string;
		updates: Partial<LocalAnnotation>;
	}) => {
		success: boolean;
	};
	DB_GET_ALL_HIGHLIGHTS: () => LocalAnnotation[];
	DB_GET_ALL_HIGHLIGHTS_BY_ID: (data: { postId: string }) => LocalAnnotation[];
	DB_DELETE_ALL_HIGHLIGHTS_BY_POST_ID: (data: { postId: string }) => {
		success: boolean;
	};
	DB_DELETE_HIGHLIGHT: (data: { id: string }) => { success: boolean };

	// 포스트
	DB_CREATE_POST: (data: { postData: LocalPost }) => { success: boolean };
	DB_UPDATE_POST: (data: { postId: string; updates: Partial<LocalPost> }) => {
		success: boolean;
	};
	DB_GET_ALL_POSTS: () => LocalPost[];
	DB_GET_POST_BY_ID: (data: { postId: string }) => LocalPost | undefined;
	DB_GET_POST_BY_URL: (data: { url: string }) => LocalPost | undefined;
	DB_DELETE_POST: (data: { postId: string }) => { success: boolean };

	// 로그인
	LOGIN_SUCCESS: (data: { session: unknown }) => { success: boolean };
}

export const { sendMessage, onMessage } =
	defineExtensionMessaging<DBProtocolMap>();
