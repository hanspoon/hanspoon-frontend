import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router";
import { BaseLayout } from "../../../components/layout/BaseLayout";
import { Profile } from "../../../components/share/Profile";

export const ProfilePage = () => {
	const { username } = useParams<{ username: string }>();

	if (username === undefined) {
		console.warn("username is undefined");
		return null;
	}

	console.log(username);

	return (
		<ErrorBoundary fallback={<div>error</div>}>
			<BaseLayout>
				<Suspense fallback={null}>
					<Profile />
				</Suspense>
				<section style={{ width: "820px" }}>
					<div>ProfilePage</div>
				</section>
			</BaseLayout>
		</ErrorBoundary>
	);
};
