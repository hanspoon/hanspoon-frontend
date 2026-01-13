import { useEffect, useState } from "react";
import { getAllPosts } from "@/apis/fetcher";
import type { HighlightSyncMessage } from "@/entrypoints/background";
import type { LocalPost } from "@/lib/highlight/types";
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

			if (message.type === "POST_CREATED" || message.type === "POST_DELETED") {
				const posts = await getAllPosts();
				setAllPosts(posts);
			}
		};

		browser.runtime.onMessage.addListener(listener);

		return () => {
			browser.runtime.onMessage.removeListener(listener);
		};
	}, []);

	if (allPosts.length === 0) {
		return (
			<div
				style={{
					padding: "20px",
					textAlign: "center",
					color: "#6b7280",
				}}
			>
				저장된 포스트가 없습니다.
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<div
				style={{
					flex: 1,
					overflowY: "auto",
					marginBottom: "20px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
					}}
				>
					<div
						style={{
							fontSize: "14px",
						}}
					>
						모든 포스트
					</div>
					{allPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
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
