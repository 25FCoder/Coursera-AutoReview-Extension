document.getElementById("autoReview").addEventListener("click", function () {
  chrome.runtime.sendMessage({ text: "auto_review" });
});
document.getElementById("linkReview").addEventListener("click", function () {
  var copyText = this;
  navigator.clipboard.writeText(copyText.value).then(
    function () {
      document.getElementById("copy").style.visibility = "visible";
      setTimeout(function () {
        document.getElementById("copy").style.visibility = "hidden";
      }, 2000);
    },
    function (err) {
      console.error("Failed to copy text: ", err);
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { text: "get_link" },
        function (response) {
          try {
            document.getElementById("linkReview").value = response.urlReview;
            let labelLinkReview = document.getElementById("lable_link_review");
            let linkReview = document.getElementById("linkReview");

            if (linkReview.value === "") {
              labelLinkReview.style.display = "none";
              linkReview.style.display = "none";
            } else {
              labelLinkReview.style.display = "block";
              linkReview.style.display = "block";
            }
          } catch (e) {
            console.log("error: ", e);
          }
        }
      );
    });
  } catch (e) {
    console.log("error: ", e);
  }
});
