
document.addEventListener('DOMContentLoaded', function () {

  function postData(input) {
    // const Http = new XMLHttpRequest();
    const url='localhost:5000/predict';
    // Http.open("GET", url);
    // Http.send();

    // Http.onreadystatechange = (e) => {
    //   console.log(Http.responseText);
    //   showResponse(Http.responseText);
    // }
    $.ajax({
      url: url,
      type: "GET",
      headers: {
        "text": input.text,
        "target": input.target
      },
      success: showResponse
    });
  }

  function logSubmit(event) {
    text = document.getElementById('text').value;
    target = document.getElementById('target').value;
    timestamp = event.timeStamp;
    
    event.preventDefault();

    // REMOVE because no need to go to a different file
    // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //   chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { text: text, target: target, time: timestamp },
    //     showResponse);
    // });
    
    postData({ text: text, target: target })

  }

  function showResponse (res) {
    logTimestamp.textContent = `Time stamp: ${timestamp}`;
    logtext.textContent = `text: ${text}`;
    logtarget.textContent = `target: ${target}`;
    logClassification.textContent = `Classification: ${res}`;
  }
  
  const form = document.getElementById('form');
  const logTimestamp = document.getElementById('log-timestamp');
  const logtext = document.getElementById('log-text');
  const logtarget = document.getElementById('log-target');
  const logClassification = document.getElementById('log-classification');

  var text = document.getElementById('text').value;
  var target = document.getElementById('target').value;
  var timestamp = ''
  
  form.addEventListener('submit', logSubmit);
  
}, false)