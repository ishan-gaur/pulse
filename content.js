// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

// function postData(input) {
//   $.ajax({
//       type: "POST",
//       url: "/test.py",
//       data: { param: input },
//       success: callbackFunc
//   });
// }

// function callbackFunc(response) {
//   // do something with the response
//   console.log(response);
// }

// alert("Hello from Pulse!")
// postData('data to process');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  postData(request)
  sendResponse({ classification: "pro" })
})