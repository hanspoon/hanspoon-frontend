import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router";
import { BaseLayout } from "../../../components/layout/BaseLayout";
import { PostGrid } from "../../../components/share/PostGrid";
import { Profile } from "../../../components/share/Profile";

export const ProfilePage = () => {
	const { username } = useParams<{ username: string }>();
	if (username === undefined) {
		console.warn("username is undefined");
		return null;
	}

	return (
		<ErrorBoundary fallback={<div>error</div>}>
			<BaseLayout>
				<Suspense fallback={null}>
					<Profile />
				</Suspense>
				<section style={{ width: "820px" }}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: "12px",
						}}
					>
						<PostGrid />
					</div>
				</section>
			</BaseLayout>
		</ErrorBoundary>
	);
};
