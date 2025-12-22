import type { LocalPost } from "../highlight/types";

export function extractPostData(): LocalPost {
	const url = window.location.href;
	const title = document.title || "제목 없음";

	const sourceDomain = new URL(url).hostname.replace(/^www\./, "");

	const favIconLink = document.querySelector(
		"link[rel~='icon']",
	) as HTMLLinkElement;
	const favIconUrl = favIconLink ? favIconLink.href : "";

	const id = crypto.randomUUID();

	return {
		id,
		url,
		title,
		favIconUrl,
		sourceDomain,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		plainText: document.body.innerText,
		shareId: null,
		isSynced: false,
	};
}
