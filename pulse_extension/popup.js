document.addEventListener('DOMContentLoaded', function () {

  function postData() {
    const xml = new XMLHttpRequest();
    const url=`http://localhost:5000/predict?title=${title}&target=${target}`;
    xml.open("GET", url);
    xml.send();

    xml.onreadystatechange = () => {
      if (xml.readyState === 4) {
        showResponse(xml.responseText);
      }
    }
  }

  function postFeedback(correct) {
    const xml = new XMLHttpRequest();
    const url=`http://localhost:5000/feedback?correct=${correct}&title=${title}&target=${target}`;
    xml.open("GET", url);
    xml.send();

    // TODO: verify success response
  }

  function showResponse(res) {
    if (res === '') {
      res = 'unable to predict'
    }
    // logTimestamp.textContent = `Time stamp: ${timestamp}`;
    logTitle.textContent = `${title}`;
    logTarget.textContent = `${target}`;
    logClassification.textContent = `${res}`;

    logClassification.style.color = (res === "Positive") ? '#21B20C' : 'red';
  }

  function logSubmit(event) {
    divOutput.style.display = 'block';

    title = document.getElementById('title').value;
    target = document.getElementById('target').value;
    timestamp = event.timeStamp;
    
    event.preventDefault();

    postData();
  }

  function yesSubmit(event) {
    event.preventDefault();
    postFeedback('yes');
    divOutput.style.display = 'none';
    document.getElementById('title').value = "";
    document.getElementById('target').value = "";
  }

  function noSubmit(event) {
    event.preventDefault();
    postFeedback('no');
    divOutput.style.display = 'none';
    document.getElementById('title').value = "";
    document.getElementById('target').value = "";
  }
  
  const form = document.getElementById('form');
  const formYes = document.getElementById('feedback-form-yes');
  const formNo = document.getElementById('feedback-form-no');

  form.addEventListener('submit', logSubmit);
  formYes.addEventListener('submit', yesSubmit);
  formNo.addEventListener('submit', noSubmit);

  const divOutput = document.getElementById('output');

  // const logTimestamp = document.getElementById('log-timestamp');
  const logTitle = document.getElementById('log-title');
  const logTarget = document.getElementById('log-target');
  const logClassification = document.getElementById('log-classification');

  var title = document.getElementById('title').value;
  var target = document.getElementById('target').value;
  var timestamp = '';
}, false)
