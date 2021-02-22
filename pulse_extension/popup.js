document.addEventListener('DOMContentLoaded', function () {

  function postData(input) {
    const Http = new XMLHttpRequest();
    const url=`http://localhost:5000/predict?title=${input.title}&target=${input.target}`;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4) {
        console.log(Http.responseText);
        showResponse(Http.responseText);
      }
    }
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

    title = document.getElementById('title').value;
    target = document.getElementById('target').value;
    timestamp = event.timeStamp;
    
    event.preventDefault();

    console.log('in logSubmit');
    postData({ title: title, target: target });
  }

  function showResponse(res) {
    logTimestamp.textContent = `Time stamp: ${timestamp}`;
    logTitle.textContent = `title: ${title}`;
    logTarget.textContent = `target: ${target}`;
    logClassification.textContent = `classification: ${res}`;
  }

  console.log('charles magic touch');
  
  const form = document.getElementById('form');
  const logTimestamp = document.getElementById('log-timestamp');
  const logTitle = document.getElementById('log-title');
  const logTarget = document.getElementById('log-target');
  const logClassification = document.getElementById('log-classification');

  var title = document.getElementById('title').value;
  var target = document.getElementById('target').value;
  var timestamp = '';
  
  form.addEventListener('submit', logSubmit);
  
}, false)
