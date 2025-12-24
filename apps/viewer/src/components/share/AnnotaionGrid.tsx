import { useQuery } from "@tanstack/react-query";
import { useShareId } from "../../hooks/useShareId";
import { annotationQueries } from "../../queries/annotationQueries";

export const AnnotaionGrid = () => {
	const currentShareId = useShareId();
	const {
		data: annotations,
		isLoading,
		error,
	} = useQuery(annotationQueries.detail(currentShareId));

	if (isLoading) return <div>로딩 중...</div>;

	if (error) return <div>에러가 발생했습니다: {error?.message}</div>;

	if (annotations === undefined) return <div>annotations is undefined</div>;

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
