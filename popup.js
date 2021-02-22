
document.addEventListener('DOMContentLoaded', function () {

  function postData(input) {
    const Http = new XMLHttpRequest();
    const url=`localhost:5000/${input.title}/${input.keyword}`;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      console.log(Http.responseText);
      showResponse(Http.responseText);
    }
  }

  function logSubmit(event) {
    title = document.getElementById('title').value;
    keyword = document.getElementById('keyword').value;
    timestamp = event.timeStamp;
    
    event.preventDefault();

    // REMOVE because no need to go to a different file
    // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //   chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { title: title, keyword: keyword, time: timestamp },
    //     showResponse);
    // });
    
    postData({ title: title, keyword: keyword })

  }

  function showResponse (res) {
    logTimestamp.textContent = `Time stamp: ${timestamp}`;
    logTitle.textContent = `Title: ${title}`;
    logKeyword.textContent = `Keyword: ${keyword}`;
    logClassification.textContent = `Classification: ${res.classification}`;
  }
  
  const form = document.getElementById('form');
  const logTimestamp = document.getElementById('log-timestamp');
  const logTitle = document.getElementById('log-title');
  const logKeyword = document.getElementById('log-keyword');
  const logClassification = document.getElementById('log-classification');

  var title = document.getElementById('title').value;
  var keyword = document.getElementById('keyword').value;
  var timestamp = ''
  
  form.addEventListener('submit', logSubmit);
  
}, false)