export default defineBackground({
	type: "module",
	main() {
		browser.runtime.onMessageExternal.addListener(
			(message, sender, sendResponse) => {
				if (message.type === "LOGIN_SUCCESS") {
					const session = message.payload;

					browser.storage.local.set({ session }, () => {
						console.log("로그인 정보 저장 완료!");
						sendResponse({ success: true });
					});

					if (sender.tab?.id) {
						browser.tabs.remove(sender.tab.id);
					}

					return true;
				}
			},
		);
	},
});
