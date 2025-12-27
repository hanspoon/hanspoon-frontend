import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AnnotaionGrid } from "../components/share/AnnotaionGrid";
import { Bookmark } from "../components/share/Bookmark";
import { Profile } from "../components/share/Profile";

const SharePage = () => {
	return (
		<ErrorBoundary fallback={null}>
			<div
				style={{
					padding: "64px",
					display: "flex",
					justifyContent: "space-around",
				}}
			>
				<Suspense fallback={null}>
					<Profile />
				</Suspense>
				<Suspense fallback={null}>
					<section
						style={{
							width: "820px",
						}}
					>
						<Bookmark />
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
							있습니다. 아직 갈 길이 멀어 보이지만 - 그래도 지금까지의 여정을
							글로 기록해보려 합니다.
						</p>
						<hr
							style={{
								background: "#d9d9d9",
								margin: "32px 0",
								height: "1px",
								border: "0",
							}}
						/>
						<AnnotaionGrid />
					</section>
				</Suspense>
			</div>
		</ErrorBoundary>
	);
};

export default SharePage;
