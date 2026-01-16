import { useState } from "react";
import type { LocalPost } from "@/lib/highlight/types";
import { useSession } from "../../hooks/useSession";
import { CardMoreAuthDropdown } from "./CardMoreAuthDropdown";
import { CardMoreGuestDropdown } from "./CardMoreGuestDropdown";

export const PostCard = ({ post }: { post: LocalPost }) => {
	const { session } = useSession();
	const isLoggedIn = !!session;
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			style={{
				position: "relative",
				height: "auto",
				border: "1px solid #D9D9D9",
				backgroundColor: "#f5f5f5",
				backgroundImage:
					"repeating-linear-gradient(45deg, transparent, transparent 10px, #e0e0e0 10px, #e0e0e0 11px)",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "90%",
					zIndex: 1,
					transform: "translate(-50%, -50%)",
				}}
			>
				{isLoggedIn ? (
					<CardMoreAuthDropdown post={post} />
				) : (
					<CardMoreGuestDropdown post={post} />
				)}
			</div>

			<button
				type="button"
				style={{
					position: "relative",
					height: "100px",
					zIndex: 2,
					padding: "12px",
					cursor: "pointer",
					transition: "all 0.2s ease-out",
					backgroundColor: "white",
					border: "1px solid #D9D9D9",
					width: isHovered ? "100%" : "80%",
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={() => {
					window.open(post.url, "_blank");
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: "4px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "6px",
							marginBottom: "6px",
						}}
					>
						{post.favIconUrl && (
							<img
								src={post.favIconUrl}
								alt=""
								style={{
									width: "14px",
									height: "14px",
									borderRadius: "2px",
								}}
							/>
						)}
						<p
							style={{
								fontSize: "11px",
								color: "#9ca3af",
							}}
						>
							{post.sourceDomain}
						</p>
					</div>
					<div
						style={{
							width: "200px",
						}}
					>
						<p
							style={{
								textAlign: "left",
								fontSize: "13px",
								fontWeight: "500",
								marginBottom: "4px",
								color: "#111827",
							}}
						>
							{post.title}
						</p>
					</div>
					<p
						style={{
							fontSize: "11px",
							color: "#d1d5db",
						}}
					>
						{new Date(post.updatedAt).toLocaleDateString("ko-KR", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>
			</button>
		</div>
	);
};
