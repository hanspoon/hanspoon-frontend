import { XMLParser } from "fast-xml-parser";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";

function App() {
	const [currentUrl, setCurrentUrl] = useState("");

	useEffect(() => {
		async function getCurrentTabUrl() {
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (tab?.url) {
				setCurrentUrl(tab.url);
			}
		}

		getCurrentTabUrl();
	}, []);

	return (
		<div>
			<p>현재 URL: {currentUrl}</p>
			<button
				type="button"
				onClick={() => {
					if (!isVelog(currentUrl)) {
						return;
					}

					const velogRSS = getVelogRss(currentUrl);
				}}
			>
				GET RSS
			</button>
		</div>
	);
}

function isVelog(url: string) {
	return url.startsWith("https://velog.io");
}

function extractVelogInfo(
	url: string,
): { userId: string; articleName: string } | null {
	const regex = /^https?:\/\/velog\.io\/@([^/]+)\/([^?]+)/;
	const match = url.match(regex);

	if (!match) {
		return null;
	}

	return {
		userId: match[1],
		articleName: match[2],
	};
}

type Feed = {
	link: string;
	description: string;
};

type VelogRSS = {
	channel: {
		item: Feed[];
	};
};

type ParsedXML = {
	"?xml": string;
	rss: VelogRSS;
};

async function getVelogRss(url: string) {
	const velogInfo = extractVelogInfo(url);

	if (!velogInfo) {
		throw new Error("Invalid Velog URL");
	}

	const velogRSSUrl = `https://v2.velog.io/rss/${velogInfo.userId}`;

	const rssResult = await getRSS(velogRSSUrl);

	const feed = rssResult.rss.channel.item.find((item) => {
		return item.link === url;
	});

	if (!feed) {
		throw new Error("피드를 찾을 수 없습니다.");
	}
	return feed?.description;
}

const parser = new XMLParser();

async function getRSS(url: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch RSS feed");
	}
	const xmlData = await response.text();

	const feed = (await parser.parse(xmlData)) as ParsedXML;
	return feed;
}

export default App;
