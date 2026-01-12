import type { LocalPost } from "@/lib/highlight/types";
import { useSession } from "../../hooks/useSession";
import { CardMoreAuthDropdown } from "./CardMoreAuthDropdown";
import { CardMoreGuestDropdown } from "./CardMoreGuestDropdown";

export const PostCard = ({ post }: { post: LocalPost }) => {
	const { session } = useSession();
	const isLoggedIn = !!session;

	return (
		/** biome-ignore lint/a11y/useKeyWithClickEvents: Post card click handler */
		/** biome-ignore lint/a11y/noStaticElementInteractions: Post card clickable */
		<div
			style={{
				padding: "16px",
				border: "1px solid #e5e7eb",
				borderRadius: "8px",
				cursor: "pointer",
				transition: "all 0.2s",
				backgroundColor: "white",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor = "#f9fafb";
				e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor = "white";
				e.currentTarget.style.boxShadow = "none";
			}}
			onClick={() => {
				window.open(post.url, "_blank");
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "8px",
				}}
			>
				<div style={{ display: "flex", gap: "4px" }}>
					{post.favIconUrl && (
						<img
							src={post.favIconUrl}
							alt=""
							style={{
								width: "16px",
								height: "16px",
								borderRadius: "2px",
							}}
						/>
					)}
					<div
						style={{
							fontSize: "12px",
							color: "#6b7280",
						}}
					>
						{post.sourceDomain}
					</div>
				</div>
				{isLoggedIn ? (
					<CardMoreAuthDropdown post={post} />
				) : (
					<CardMoreGuestDropdown post={post} />
				)}
			</div>
			<div
				style={{
					fontSize: "16px",
					fontWeight: "600",
					marginBottom: "8px",
					color: "#111827",
				}}
			>
				{post.title}
			</div>
			<div
				style={{
					fontSize: "12px",
					color: "#9ca3af",
				}}
			>
				{new Date(post.updatedAt).toLocaleDateString("ko-KR", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</div>
		</div>
	);
};
