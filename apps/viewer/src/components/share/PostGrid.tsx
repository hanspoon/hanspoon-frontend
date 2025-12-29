import { useSuspenseQuery } from "@tanstack/react-query";
import ResponsiveReactGridLayout, {
	type ResizeHandleAxis,
	useContainerWidth,
} from "react-grid-layout";
import { allPostQueryOptions } from "../../queries/post";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useNavigate } from "react-router";

const HANDLES: ResizeHandleAxis[] = ["s", "w", "e", "n"];

interface PostGridProps {
	isEditable: boolean;
}

export const PostGrid = ({ isEditable }: PostGridProps) => {
	const { width, containerRef, mounted } = useContainerWidth();
	const { data: posts } = useSuspenseQuery(allPostQueryOptions());
	const navigate = useNavigate();

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: "12px",
			}}
		>
			<div ref={containerRef} style={{ width: "820px" }}>
				{mounted && (
					<ResponsiveReactGridLayout
						layout={posts.map((post, index) => ({
							i: post.id,
							x: index % 3,
							y: Math.floor(index / 3),
							w: 1,
							h: 1.5,
							resizeHandles: isEditable ? HANDLES : [],
							isDraggable: isEditable,
							isResizable: isEditable,
						}))}
						width={width}
						gridConfig={{ cols: 3, rowHeight: 180 }}
					>
						{posts.map((post) => {
							return (
								<button
									onClick={() =>
										!isEditable && navigate(`/share/${post.share_id}`)
									}
									type="button"
									key={post.id}
									style={{
										border: "1px solid #EBEBEB",
										aspectRatio: "1/1",
										borderRadius: "24px",
										padding: "24px",
									}}
								>
									{post.title}
								</button>
							);
						})}
					</ResponsiveReactGridLayout>
				)}
			</div>
		</div>
	);
};
