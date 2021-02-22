document.addEventListener('DOMContentLoaded', function () {

  function postData(input) {
    const xml = new XMLHttpRequest();
    const url=`http://localhost:5000/predict?title=${input.title}&target=${input.target}`;
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
    const url=`http://localhost:5000/feedback?correct=${correct}&title=${input.title}&target=${input.target}`;
    xml.open("POST", url);
    xml.send();
  }

  function showResponse(res) {
    logTimestamp.textContent = `Time stamp: ${timestamp}`;
    logTitle.textContent = `title: ${title}`;
    logTarget.textContent = `target: ${target}`;
    logClassification.textContent = `classification: ${res}`;
  }

  function logSubmit(event) {
    title = document.getElementById('title').value;
    target = document.getElementById('target').value;
    timestamp = event.timeStamp;
    
    event.preventDefault();

    postData({ title: title, target: target });
  }

  function yesSubmit(event) {
    event.preventDefault();
    postFeedback('yes');
  }

  function noSubmit(event) {
    event.preventDefault();
    postFeedback('no');
  }
  
  const form = document.getElementById('form');
  const formYes = document.getElementById('feedback-form-yes');
  const formNo = document.getElementById('feedback-form-no');

  form.addEventListener('submit', logSubmit);
  formYes.addEventListener('submit', yesSubmit);
  formNo.addEventListener('submit', noSubmit);

  const logTimestamp = document.getElementById('log-timestamp');
  const logTitle = document.getElementById('log-title');
  const logTarget = document.getElementById('log-target');
  const logClassification = document.getElementById('log-classification');

  var title = document.getElementById('title').value;
  var target = document.getElementById('target').value;
  var timestamp = '';
}, false)
