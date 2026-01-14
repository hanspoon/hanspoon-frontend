import logo from "../../../public/logo.svg";

export const FloatingLogo = () => {
	return (
		<>
			<img
				className="floating-logo"
				src={logo}
				width={48}
				height={48}
				alt="logo"
			/>
			<style>{`
			@keyframes float {
				0% {
					transform: translateY(0px);
				}
				50% {
					transform: translateY(-2px);
				}
				100% {
					transform: translateY(0px);
				}
			}

			.floating-logo {
				animation: float 2.5s ease-in-out infinite;
			}
`}</style>
		</>
	);
};
