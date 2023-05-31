let lastTabId = 0;

//beforeunload

const sendCurentTab = (domain) => {
	fetch("http://localhost:9807/current-tab", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ domain }),
	});
};

// listen for active tab change
chrome.tabs.onActivated.addListener(function (activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function (tab) {
		// send message to content script
		lastTabId = tab?.id;
		if (!tab?.url) return;
		const domain = new URL(tab.url).hostname;
		sendCurentTab(domain);
		chrome.tabs.sendMessage(tab.id, { message: "tabChanged", tab: { ...tab, domain } });
	});
});
// Listen for getActiveTab message from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message === "getActiveTab") {
		if (lastTabId === 0)
			chrome.tabs.query(
				{
					active: true,
					currentWindow: true,
				},
				function (tabs) {
					let tab = tabs[0];
					if (!tab?.url) return;
					const domain = new URL(tab.url).hostname;
					sendCurentTab(domain);

					sendResponse({ tab: { ...tab, domain } });
				}
			);
		else
			chrome.tabs.get(lastTabId, function (tab) {
				if (!tab?.url) return;
				const domain = new URL(tab.url).hostname;
				sendCurentTab(domain);

				sendResponse({ tab: { ...tab, domain } });
			});
	}
	return true;
});
