import { useSuspenseQuery } from "@tanstack/react-query";
import { useShareId } from "../../hooks/useShareId";
import { annotationQueries } from "../../queries/annotationQueries";

export const AnnotaionGrid = () => {
	const currentShareId = useShareId();
	const { data: annotations } = useSuspenseQuery(
		annotationQueries.detail(currentShareId),
	);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: "12px",
			}}
		>
			{annotations.map((highlight, index) => (
				<div
					key={`${highlight.id || highlight.text}-${index}`}
					style={{
						border: "1px solid #EBEBEB",
						aspectRatio: "1/1",
						borderRadius: "24px",
						padding: "24px",
					}}
				>
					{highlight.text}
				</div>
			))}
		</div>
	);
};
