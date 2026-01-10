/**
 * chrome.storage를 사용한 탭 간 동기화 신호 시스템
 * IndexedDB는 실제 데이터 저장소로 사용하고,
 * chrome.storage는 변경 신호만 전달
 */

export type HighlightChangeAction = "HIGHLIGHT_ADDED" | "HIGHLIGHT_DELETED";

export interface HighlightChangeSignal {
	id: string;
	postId: string;
	action: HighlightChangeAction;
	timestamp: number;
}

/**
 * 하이라이트 변경 신호를 chrome.storage에 저장
 * 모든 탭에서 chrome.storage.onChanged로 감지 가능
 */
export const notifyHighlightChange = async (signal: {
	id: string;
	postId: string;
	action: HighlightChangeAction;
}) => {
	const changeSignal: HighlightChangeSignal = {
		...signal,
		timestamp: Date.now(),
	};

	// chrome.storage에 저장하면 모든 탭에 브로드캐스트됨
	await browser.storage.local.set({
		highlightChange: changeSignal,
	});
};

/**
 * chrome.storage 변경 감지 리스너 등록
 * 하이라이트 변경 시 콜백 실행
 */
export const onHighlightChange = (
	callback: (signal: HighlightChangeSignal) => void,
) => {
	const listener = (
		changes: { [key: string]: any },
		areaName: string,
	) => {
		// local storage 변경만 처리
		if (areaName !== "local") return;

		// highlightChange 키 변경 감지
		if (changes.highlightChange?.newValue) {
			const signal = changes.highlightChange.newValue as HighlightChangeSignal;
			callback(signal);
		}
	};

	browser.storage.onChanged.addListener(listener);

	// 리스너 제거 함수 반환
	return () => {
		browser.storage.onChanged.removeListener(listener);
	};
};
