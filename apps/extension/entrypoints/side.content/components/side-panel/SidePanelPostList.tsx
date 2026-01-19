import { useEffect, useSyncExternalStore } from "react";
import { postSyncStore } from "@/lib/sync/postSyncStore";
import { BlinkingText } from "../../../../components/common/BlinkingText";
import { PostCard } from "./PostCard";

export const SidePanelPostList = () => {
	const { posts: allPosts } = useSyncExternalStore(
		postSyncStore.subscribe,
		postSyncStore.getSnapshot,
	);

	useEffect(() => {
		postSyncStore.initialize();
	}, []);

	if (allPosts.length === 0) {
		return <EmptyPostList />;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				padding: "10px 0px",
				gap: "8px",
			}}
		>
			<div
				style={{
					flex: 1,
					overflowY: "auto",
					display: "flex",
					marginBottom: "20px",
					flexDirection: "column",
				}}
			>
				{allPosts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
};

const EmptyPostList = () => {
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
};
