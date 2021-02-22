
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
    console.log('in postData');
    // $.ajax({
    //   url: url,
    //   type: "GET",
    //   headers: {
    //     "text": input.text,
    //     "target": input.target
    //   },
    //   success: showResponse
    // });


    // ajax = function(options, callback) {
    //   var xhr;
    //   xhr = new XMLHttpRequest();
    //   xhr.open(options.type, options.url, options.async || true);
    //   xhr.onreadystatechange = function() {
    //     if (xhr.readyState === 4) {
    //       return callback(xhr.responseText);
    //     }
    //   };
    //   return xhr.send();
    // };
  }

  function logSubmit(event) {
    console.log('in logSubmit');

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
    console.log('in logSubmit');
    postData({ text: text, target: target });

  }

  function showResponse (res) {
    logTimestamp.textContent = `Time stamp: ${timestamp}`;
    logtext.textContent = `text: ${text}`;
    logtarget.textContent = `target: ${target}`;
    logClassification.textContent = `Classification: ${res}`;
  }

  console.log('charles magic touch');
  
  const form = document.getElementById('form');
  const logTimestamp = document.getElementById('log-timestamp');
  const logtext = document.getElementById('log-text');
  const logtarget = document.getElementById('log-target');
  const logClassification = document.getElementById('log-classification');

  var text = document.getElementById('title').value;
  var target = document.getElementById('target').value;
  var timestamp = '';
  
  form.addEventListener('submit', logSubmit);
  
}, false)