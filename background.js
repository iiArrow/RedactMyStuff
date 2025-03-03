// Inject content.js into all existing open tabs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            if (tab.url.startsWith("http") || tab.url.startsWith("https")) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                });
            }
        }
    });
});

// Inject script when the extension is restarted (helps on browser restart)
chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            if (tab.url.startsWith("http") || tab.url.startsWith("https")) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                });
            }
        }
    });
});
