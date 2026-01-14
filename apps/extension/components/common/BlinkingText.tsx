interface BlinkingTextProps {
	children: React.ReactNode;
	interval?: number;
	pauseOnHover?: boolean;
	pauseOnParentHover?: boolean;
}

export const BlinkingText = ({
	children,
	interval = 1,
	pauseOnHover,
	pauseOnParentHover,
}: BlinkingTextProps) => {
	const classNames = [
		"blink",
		pauseOnHover ? "pause-hover" : "",
		pauseOnParentHover ? "pause-parent-hover" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<>
			<span className={classNames}>{children}</span>
			<style>{`
        @keyframes blink-animation {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .blink {
          animation: blink-animation ${interval}s step-end infinite;
        }

        .pause-hover:hover {
          animation-play-state: paused;
          opacity: 1;
        }

        .blink-parent:hover .pause-parent-hover {
          animation-play-state: paused;
          opacity: 1;
        }
      `}</style>
		</>
	);
};
