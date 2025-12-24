import { useQuery } from "@tanstack/react-query";
import { annotationQueries } from "../queries/annotationQueries";
import { postQueries } from "../queries/postQueries";
import { userInfoQueries } from "../queries/userInfoQueries";

const SharePage = () => {
	const { data: userInfo } = useQuery(userInfoQueries.detail());

	const currentShareId = window.location.pathname.split("/")[2];

	const {
		data: annotations,
		isLoading,
		error,
	} = useQuery(annotationQueries.detail(currentShareId));

	const {
		data: post,
		isLoading: postLoading,
		error: postError,
	} = useQuery(postQueries.detail(currentShareId));

	if (isLoading || postLoading) return <div>로딩 중...</div>;
	if (error || postError)
		return <div>에러가 발생했습니다: {error?.message}</div>;

	if (annotations === undefined) return <div>annotations is undefined</div>;
	if (post === undefined) return <div>post is undefined</div>;

	return (
		<div
			style={{
				padding: "64px",
				display: "flex",
				justifyContent: "space-around",
			}}
		>
			{/* PROFILE */}
			<section
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "12px",
				}}
			>
				<img
					src={userInfo?.user?.user_metadata?.avatar_url}
					alt="profile_image"
					width={184}
					height={184}
					style={{
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
				<h1 style={{ fontSize: "44px", fontWeight: "bold" }}>
					{userInfo?.user?.user_metadata?.full_name}
				</h1>
				<p style={{ fontSize: "20px", color: "#565656", width: "400px" }}>
					📚 Haebom의 아카이브에 오신 걸 환영합니다.---IT 💻, 경제 💰, 인문학
					<br />
					🎭을 관된 글을 올립니다.제 생각과 관점 혹은 관심사가 궁금하시면
					<br />
					구독해주세요.haebom@kakao.com
				</p>
			</section>
			{/* SHARE */}
			<section
				style={{
					width: "820px",
				}}
			>
				<a
					href={post.id}
					style={{
						width: "820px",
						height: "175px",
						borderRadius: "24px",
						border: "1px solid #e5e5e5",
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							padding: "24px",
						}}
					>
						<p>{post.title}</p>
						<p style={{ color: "#565656" }}>{post.url}</p>
					</div>
					<img
						src="https://i.pinimg.com/1200x/7d/ef/1e/7def1e13b878405623f041c5b96e7a60.jpg"
						alt="profile_image"
						width={234}
						height={175}
						style={{
							objectFit: "cover",
							borderTopRightRadius: "24px",
							borderBottomRightRadius: "24px",
						}}
					/>
				</a>
				<p
					style={{
						fontSize: "14px",
						color: "#565656",
						margin: "32px 0",
						padding: "0 12px",
					}}
				>
					지난 몇 달 간 마우스 없이 개발하는 능력을 기르는 데에 많은 노력을
					쏟아보았고, 그 결과 지금은 마우스를 거의 사용하지 않고 개발을 하고
					있습니다. 아직 갈 길이 멀어 보이지만 - 그래도 지금까지의 여정을 글로
					기록해보려 합니다.
				</p>
				<hr
					style={{
						background: "#d9d9d9",
						margin: "32px 0",
						height: "1px",
						border: "0",
					}}
				/>
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
			</section>
		</div>
	);
};

export default SharePage;
