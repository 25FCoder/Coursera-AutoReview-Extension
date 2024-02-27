let contentScriptReady = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.text === "content_script_ready") {
      contentScriptReady = true;
    }
    if (request.text === "auto_review" && contentScriptReady) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const request = {
          text: "auto_review",
        };
        chrome.tabs.sendMessage(tabs[0].id, request);
      });
    } else if (request.text === "get_link") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const request = {
          text: "get_link",
        };
        chrome.tabs.sendMessage(tabs[0].id, request);
      });
    }
  } catch (e) {
    console.log("error", e);
  }
});
