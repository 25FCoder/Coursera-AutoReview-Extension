function review_other(elements) {
  for (var i = 0; i < elements.length; i++) {
    var options = elements[i].getElementsByClassName("option-input");
    var maxPts = -1;
    var maxPtsOption = null;
    for (var j = 0; j < options.length; j++) {
      var option = options[j];
      var ptsSpan = option.parentElement.querySelector("span");
      if (ptsSpan) {
        var ptsText = ptsSpan.textContent;
        var ptsNumber = ptsText.split(" ")[0];
        var pts = parseInt(ptsNumber);
        if (isNaN(pts)) continue;
        if (pts > maxPts) {
          maxPts = pts;
          maxPtsOption = option;
        }
      }
    }
    if (maxPtsOption) {
      maxPtsOption.click();
    }
  }
}

chrome.runtime.sendMessage({ text: "content_script_ready" });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.text === "auto_review") {
    var divs = document.getElementsByClassName("rc-OptionsFormPart");
    review_other(divs);
    var yesnos = document.getElementsByClassName("rc-YesNoFormPart");
    review_other(yesnos);
    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
      textareas[i].value = "25FM";
      var event = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      textareas[i].dispatchEvent(event);
    }
    setTimeout(function () {
      var submit_review = document.body.getElementsByTagName("button");
      for (var i = 0; i < submit_review.length; i++) {
        if (submit_review[i].textContent === "Submit Review") {
          submit_review[i].click();
          break;
        }
      }
    }, 500);
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    var urlReview = "";
    if (request.text === "get_link") {
      var reviewElement = document.querySelector("textarea");
      if (reviewElement) {
        var reviewId = reviewElement.id;
        var reviewIdWithoutTilde = reviewId.split("~")[0];
        var currentUrl = window.location.href;
        if (currentUrl.slice(-6) !== "submit") {
          urlReview =
            currentUrl.slice(0, -11) + "review/" + reviewIdWithoutTilde;
        } else {
          urlReview =
            currentUrl.slice(0, -6) + "review/" + reviewIdWithoutTilde;
        }
      }
    }
    sendResponse({ urlReview: urlReview.toString() });
    return true;
  } catch (e) {
    console.log("error", e);
  }
});
