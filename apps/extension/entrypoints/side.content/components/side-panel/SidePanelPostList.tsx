import { useEffect, useState } from "react";
import { getAllPosts } from "@/apis/fetcher";
import type { HighlightSyncMessage } from "@/entrypoints/background";
import type { LocalPost } from "@/lib/highlight/types";
import { BlinkingText } from "../../../../components/common/BlinkingText";
import { PostCard } from "./PostCard";

export const SidePanelPostList = () => {
	const [allPosts, setAllPosts] = useState<LocalPost[]>([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const posts = await getAllPosts();
			setAllPosts(posts);
		};
		fetchPosts();
	}, []);

	useEffect(() => {
		const listener = async (message: unknown) => {
			if (!isHighlightSyncMessage(message)) {
				return;
			}

			if (message.type === "POST_CREATED") {
				setAllPosts(allPosts);
			}

			if (message.type === "POST_DELETED") {
				setAllPosts(allPosts);
			}
		};

		browser.runtime.onMessage.addListener(listener);

		return () => {
			browser.runtime.onMessage.removeListener(listener);
		};
	}, [allPosts]);

	if (allPosts.length === 0) {
		return (
			<div
				style={{
					height: "100%",
					padding: "20px",
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					color: "#6b7280",
					fontFamily: "Umdot",
				}}
			>
				<div>
					ㄴH 공간ㅇl... ㄴㅓ무 비었ㄴl..<BlinkingText>?</BlinkingText>
				</div>
				<div>
					ュ럼... 하나만 '하이라이트' ㅎH줄ㄹH..<BlinkingText>?</BlinkingText>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				padding: "10px 0px",
			}}
		>
			<div
				style={{
					fontSize: "14px",
					marginBottom: "8px",
				}}
			>
				모든 포스트
			</div>
			<div
				style={{
					flex: 1,
					overflowY: "auto",
					marginBottom: "20px",
					display: "flex",
					flexDirection: "column",
					gap: "8px",
				}}
			>
				{allPosts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
};

const isHighlightSyncMessage = (
	message: unknown,
): message is HighlightSyncMessage => {
	if (
		message &&
		typeof message === "object" &&
		"type" in message &&
		typeof message.type === "string" &&
		[
			"HIGHLIGHT_CREATED",
			"HIGHLIGHT_DELETED",
			"POST_CREATED",
			"POST_DELETED",
		].includes(message.type as HighlightSyncMessage["type"])
	) {
		return true;
	}

	return false;
};
