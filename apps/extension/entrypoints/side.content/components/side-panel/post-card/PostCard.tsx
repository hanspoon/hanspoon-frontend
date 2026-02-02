import { useEffect, useState } from "react";
import { storage } from "@/apis/browser-storage";
import type { LocalPost } from "@/lib/highlight/types";
import { CardMoreAuthDropdown } from "./CardMoreAuthDropdown";
import { CardMoreGuestDropdown } from "./CardMoreGuestDropdown";

export const PostCard = ({ post }: { post: LocalPost }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		storage.get("session").then((session) => {
			setIsLoggedIn(!!session);
		});

		return storage.subscribe("session", (newValue) => {
			setIsLoggedIn(!!newValue);
		});
	}, []);

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
			<PostCardActionLayer isLoggedIn={isLoggedIn} post={post} />

			<PostContentCard
				post={post}
				isHovered={isHovered}
				setIsHovered={setIsHovered}
			/>
		</div>
	);
};

const PostCardActionLayer = ({
	isLoggedIn,
	post,
}: {
	isLoggedIn: boolean;
	post: LocalPost;
}) => {
	return (
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
	);
};

const PostContentCard = ({
	post,
	isHovered,
	setIsHovered,
}: {
	post: LocalPost;
	isHovered: boolean;
	setIsHovered: (hovered: boolean) => void;
}) => {
	return (
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
				<p
					style={{
						textAlign: "left",
						fontSize: "13px",
						fontWeight: "500",
						marginBottom: "4px",
						color: "#111827",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						lineHeight: "1.4",
					}}
				>
					{post.title}
				</p>
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
	);
};
