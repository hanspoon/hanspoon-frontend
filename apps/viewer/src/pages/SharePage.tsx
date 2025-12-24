import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const fetchAnnotations = async (shareId: string) => {
	const sessionStr = localStorage.getItem("session");
	if (!sessionStr) {
		throw new Error("No session found");
	}
	const session = JSON.parse(sessionStr);
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token,
	});

	if (sessionError) throw sessionError;
	const { data: annotations, error: fetchError } = await supabase
		.from("annotations")
		.select()
		.eq("share_id", shareId);
	if (fetchError) throw fetchError;
	return annotations;
};

const fetchPost = async (shareId: string) => {
	const sessionStr = localStorage.getItem("session");
	if (!sessionStr) {
		throw new Error("No session found");
	}
	const session = JSON.parse(sessionStr);
	const { error: sessionError } = await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token,
	});

	if (sessionError) throw sessionError;
	const { data: post, error: fetchError } = await supabase
		.from("posts")
		.select()
		.eq("share_id", shareId);
	if (fetchError) throw fetchError;
	return post;
};

const Share = () => {
	const sessionStr = localStorage.getItem("session");
	if (!sessionStr) {
		throw new Error("No session found");
	}
	const session = JSON.parse(sessionStr);
	const currentShareId = window.location.pathname.split("/")[2];
	const {
		data: annotations,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["annotations", currentShareId],
		queryFn: () => fetchAnnotations(currentShareId),
		enabled: !!currentShareId,
	});

	const {
		data: post,
		isLoading: postLoading,
		error: postError,
	} = useQuery({
		queryKey: ["posts", currentShareId],
		queryFn: () => fetchPost(currentShareId),
		enabled: !!currentShareId,
	});
	if (isLoading || postLoading) return <div>로딩 중...</div>;
	if (error || postError)
		return <div>에러가 발생했습니다: {error?.message}</div>;

	console.log("annotations", annotations);
	console.log("post", post);

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
					// src="https://i.pinimg.com/1200x/7d/ef/1e/7def1e13b878405623f041c5b96e7a60.jpg"
					src={session.user.user_metadata.avatar_url}
					alt="profile_image"
					width={184}
					height={184}
					style={{
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
				<h1 style={{ fontSize: "44px", fontWeight: "bold" }}>
					{session.user.user_metadata.full_name}
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
					href="https://velog.io/@woohm402/no-mouse-1-vscode"
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
						<p>{post[0].title}</p>
						<p style={{ color: "#565656" }}>{post[0].url}</p>
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
							key={highlight.text}
							style={{
								border: "1px solid #EBEBEB",
								aspectRatio: "1/1",
								borderRadius: "24px",
								padding: "24px",
							}}
						>
							{annotations[index].text}
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default Share;
