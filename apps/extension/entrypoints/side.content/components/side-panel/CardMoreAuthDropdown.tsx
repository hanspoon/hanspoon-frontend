import { useState } from "react";
import { syncPostToSupabase } from "@/lib/highlight/syncPostToSupabase";
import type { LocalPost } from "@/lib/highlight/types";
import {
	deleteAllHighlightsByPostId,
	deletePost,
	updatePost,
} from "../../../../apis/fetcher";
import menuDots from "../../../../public/menu-dots.svg";
import { useSession } from "../../hooks/useSession";
import { Dropdown, type DropdownMenuItem } from "../common/Dropdown";

interface CardMoreAuthDropdownProps {
	post: LocalPost;
}

export const CardMoreAuthDropdown = ({ post }: CardMoreAuthDropdownProps) => {
	const [isPublished, setIsPublished] = useState(post.isPublished);
	const { session } = useSession();

	const handleTogglePublish = async () => {
		const newPublishState = !isPublished;

		if (newPublishState) {
			if (!session) {
				alert("로그인이 필요합니다!");
				return;
			}
			try {
				await syncPostToSupabase(post.id, session);
			} catch (error) {
				console.error("Supabase 동기화 실패:", error);
				alert("공유 준비에 실패했습니다.");
				return;
			}
		}

		setIsPublished(newPublishState);

		try {
			await updatePost({
				postId: post.id,
				updates: { isPublished: newPublishState },
			});
		} catch (error) {
			console.error("포스트 업데이트 실패:", error);
			setIsPublished(!newPublishState);
			alert("상태 변경에 실패했습니다.");
		}
	};

	const handleViewSite = () => {
		if (!isPublished || !post.shareId) return;
		const shareUrl = `http://localhost:5173/shared/${post.shareId}`;
		window.open(shareUrl, "_blank");
	};

	const handleCopyLink = async () => {
		if (!isPublished || !post.shareId) return;
		const shareUrl = `http://localhost:5173/shared/${post.shareId}`;

		try {
			await navigator.clipboard.writeText(shareUrl);
			alert("링크가 복사되었습니다!");
		} catch (error) {
			console.error("링크 복사 실패:", error);
			alert("링크 복사에 실패했습니다.");
		}
	};

	const handleRemove = async () => {
		if (
			!confirm(
				"이 포스트를 삭제하시겠습니까? 관련된 모든 하이라이트도 함께 삭제됩니다.",
			)
		) {
			return;
		}

		try {
			await deleteAllHighlightsByPostId(post.id);
			await deletePost(post.id);
			alert("포스트가 삭제되었습니다.");
		} catch (error) {
			console.error("포스트 삭제 실패:", error);
			alert("포스트 삭제에 실패했습니다.");
		}
	};

	const menuItems: DropdownMenuItem[] = [
		{
			label: isPublished ? "unpublish" : "publish",
			onClick: handleTogglePublish,
		},
		{
			label: "view site",
			onClick: handleViewSite,
			disabled: !isPublished,
			icon: !isPublished ? "🔒" : undefined,
		},
		{
			label: "copy link",
			onClick: handleCopyLink,
			disabled: !isPublished,
			icon: !isPublished ? "🔒" : undefined,
		},
		{
			label: "remove",
			onClick: handleRemove,
		},
	];

	return (
		<Dropdown
			trigger={
				/** biome-ignore lint/a11y/noStaticElementInteractions: Dropdown trigger with hover effect */
				<div
					style={{
						padding: "6px",
						borderRadius: "4px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						transition: "background-color 0.2s",
						cursor: "pointer",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#f3f4f6";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					<img
						src={menuDots}
						width={12}
						height={12}
						alt="menu-dot"
						style={{ display: "block" }}
					/>
				</div>
			}
			items={menuItems}
			position="bottom-right"
		/>
	);
};
