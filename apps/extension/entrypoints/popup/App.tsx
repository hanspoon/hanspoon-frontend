import logo from "../../public/logo.svg";
import { usePopupFloatingButtonConfig } from "./hooks/usePopupFloatingButtonConfig";

const App = () => {
	const {
		isLoaded,
		currentTabDomain,
		enableGlobally,
		enableForCurrentSite,
		isEnabledGlobally,
		isEnabledForCurrentSite,
	} = usePopupFloatingButtonConfig();

	if (!isLoaded) {
		return (
			<div
				style={{
					padding: "16px",
					width: "200px",
					height: "200px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div>로딩 중...</div>
			</div>
		);
	}

	const globallyEnabled = isEnabledGlobally();
	const siteEnabled = isEnabledForCurrentSite();
	const allEnabled = globallyEnabled && siteEnabled;

	return (
		<div
			style={{
				padding: "16px",
				width: "160px",
				display: "flex",
				flexDirection: "column",
				gap: "12px",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: "8px",
				}}
			>
				<img src={logo} width={48} height={48} alt="logo" />
			</div>

			<section
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "8px",
				}}
			>
				{!globallyEnabled && (
					<button
						type="button"
						onClick={enableGlobally}
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
					>
						{">"} 전역 활성화
					</button>
				)}

				{globallyEnabled && !siteEnabled && currentTabDomain && (
					<button
						type="button"
						onClick={enableForCurrentSite}
						style={{
							cursor: "pointer",
							fontWeight: "bold",
						}}
					>
						{">"} {currentTabDomain} 활성화
					</button>
				)}

				{allEnabled && (
					<div
						style={{
							padding: "12px",
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						모든 사이트에서 <br />
						한스푼 활성화 중...
					</div>
				)}
			</section>
		</div>
	);
};

export default App;
