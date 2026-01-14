import { BlinkingText } from "@/components/common/BlinkingText";
import { FloatingLogo } from "./components/FloatingLogo";
import { LoadingDots } from "./components/LoadingDots";
import { useFloatingButtonSettings } from "./hooks/useFloatingButtonSettings";

export const HanspoonPopup = () => {
	const {
		isLoaded,
		currentTabDomain,
		enableGlobally,
		enableForCurrentSite,
		isEnabledGlobally,
		isEnabledForCurrentSite,
	} = useFloatingButtonSettings();

	if (!isLoaded) {
		return <LoadingContainer />;
	}

	const getFloatingButtonSatatus = () => {
		const globallyEnabled = isEnabledGlobally();
		const siteEnabled = isEnabledForCurrentSite();

		if (!globallyEnabled) return "GLOBAL_DISABLED";
		if (!siteEnabled) return "SITE_DISABLED";
		return "ALL_ENABLED";
	};

	const renderStatus = {
		GLOBAL_DISABLED: (
			<ActionButton onClick={enableGlobally} label="전역 활성화" />
		),
		SITE_DISABLED: (
			<ActionButton
				onClick={enableForCurrentSite}
				label={`${currentTabDomain} 활성화`}
			/>
		),
		ALL_ENABLED: <ActivationIndicator />,
	};

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
				<FloatingLogo />
			</div>

			<section
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "8px",
				}}
			>
				{renderStatus[getFloatingButtonSatatus()]}
			</section>
		</div>
	);
};

const LoadingContainer = () => (
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
		<div>
			로딩 중<LoadingDots />
		</div>
	</div>
);

const ActionButton = ({
	onClick,
	label,
}: {
	onClick: () => void;
	label: string;
}) => (
	<button
		type="button"
		onClick={onClick}
		className="blink-parent"
		style={{
			cursor: "pointer",
			fontWeight: "bold",
		}}
	>
		<BlinkingText pauseOnParentHover>{">"}</BlinkingText>
		&nbsp;{label}
	</button>
);

const ActivationIndicator = () => {
	return (
		<div
			style={{
				padding: "12px",
				textAlign: "center",
				fontWeight: "bold",
			}}
		>
			모든 사이트에서 <br />
			한스푼 활성화 중<LoadingDots />
		</div>
	);
};
