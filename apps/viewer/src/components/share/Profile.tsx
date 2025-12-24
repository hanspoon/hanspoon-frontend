import { useQuery } from "@tanstack/react-query";
import { userInfoQueries } from "../../queries/userInfoQueries";

export const Profile = () => {
	const {
		data: userInfo,
		isLoading,
		isError,
	} = useQuery(userInfoQueries.detail());

	if (isLoading) return <div>로딩 중...</div>;
	if (isError) return <div>에러가 발생했습니다</div>;
	if (!userInfo) return null;

	return (
		<section
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "12px",
			}}
		>
			<img
				src={userInfo.user.user_metadata.avatar_url}
				alt="profile_image"
				width={184}
				height={184}
				style={{
					borderRadius: "50%",
					objectFit: "cover",
				}}
			/>
			<h1 style={{ fontSize: "44px", fontWeight: "bold" }}>
				{userInfo.user.user_metadata.full_name}
			</h1>
			<p style={{ fontSize: "20px", color: "#565656", width: "400px" }}>
				📚 Haebom의 아카이브에 오신 걸 환영합니다.---IT 💻, 경제 💰, 인문학
				<br />
				🎭을 관된 글을 올립니다.제 생각과 관점 혹은 관심사가 궁금하시면
				<br />
				구독해주세요.haebom@kakao.com
			</p>
		</section>
	);
};
