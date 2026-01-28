import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import type { LocalPost } from "@/lib/highlight/types";
import {
	deleteAllHighlightsByPostId,
	deletePost,
} from "../../../../apis/fetcher";
import menuDots from "../../../../public/menu-dots.svg";
import { Dropdown, type DropdownMenuItem } from "../common/Dropdown";
import { Modal } from "../common/Modal";
import { useToast } from "../common/Toast";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface CardMoreGuestDropdownProps {
	post: LocalPost;
}

export const CardMoreGuestDropdown = ({ post }: CardMoreGuestDropdownProps) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const { showToast } = useToast();

	const handleLogin = async () => {
		console.log("handleLogin");
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
					redirectTo: import.meta.env.DEV
					? "http://localhost:5173/auth/callback"
					: "https://hanspoon.vercel.app/auth/callback",
					skipBrowserRedirect: true,
				},
			});

			if (error) {
				console.error("Google 로그인 오류:", error);
				return;
			}

			if (data.url) {
				window.open(data.url, "_blank");
			}
		} catch (error) {
			console.error("Unexpected crash:", error);
		}
	};

	const handleRemoveClick = () => {
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		setIsDeleteModalOpen(false);
		try {
			await deleteAllHighlightsByPostId(post.id);
			await deletePost(post.id);
			showToast("포스트가 삭제되었습니다.", "success");
		} catch (error) {
			console.error("포스트 삭제 실패:", error);
			showToast("포스트 삭제에 실패했습니다.", "error");
		}
	};

	const menuItems: DropdownMenuItem[] = [
		{
			label: "google login",
			onClick: () => {
				handleLogin();
			},
		},
		{
			label: "remove",
			onClick: handleRemoveClick,
		},
	];

	return (
		<>
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
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="포스트 삭제"
				confirmText="삭제"
				cancelText="취소"
				onConfirm={handleConfirmDelete}
				confirmVariant="danger"
			>
				이 포스트를 삭제하시겠습니까? 관련된 모든 하이라이트도 함께 삭제됩니다.
			</Modal>
		</>
	);
};
