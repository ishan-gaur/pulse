// document.addEventListener('DOMContentLoaded', function () {
  function postData(i, title, target) {
    const xml = new XMLHttpRequest();
    const url=`http://localhost:5000/predict?title=${title}&target=${target}`;
    xml.open("GET", url);
    xml.send();

    xml.onreadystatechange = () => {
      if (xml.readyState === 4) {
        console.log(xml);
        console.log(xml.responseText);
        showResponse(i, xml.responseText);
      }
    }
  }

  function showResponse(i, res) {
    if (res === '') {
      res = 'unable to predict'
    }
    console.log(`raw res: ${res}`);

    // ! RANDOM NUMBER GENERATOR
    randPred = Math.floor(Math.random() * 4);
    if (randPred == 0) {
      res = "Positive";
    } else if (randPred == 1) {
      res = "Negative";
    } else if (randPred == 2) {
      res = "Neutral";
    } else if (randPred == 3) {
      res = "unable to predict";
    }
    console.log(`new res: ${res}`);

    const parent = results[i].parentElement.parentElement.parentElement; //.parentElement;
    // parent.setAttribute("style", "display:flex; flex-direction:row;")

    // TODO: decompose into styles.css

    const newDiv = document.createElement("div");
    // newDiv.setAttribute("style", "display:flex; flex-direction:row; font-size:medium; width:20px;")
    newDiv.setAttribute("style", "position:absolute; left:-25px; top:32px; display:flex; flex-direction:row; align-items:center; font-size:medium;")
    const circle = document.createElement("div");
    const label = document.createElement("span");
    label.setAttribute("style", "color:gray")
    var text = null;
    if (res === "Positive") {
      circle.setAttribute("style", "height:10px; width:10px; background-color:green; border-radius:50%;");
      text = document.createTextNode("Positive");
    } else if (res === "Negative") {
      circle.setAttribute("style", "height:10px; width:10px; background-color:red; border-radius:50%;");
      text = document.createTextNode("Negative");
    } else if (res === "Neutral") {
      circle.setAttribute("style", "height:10px; width:10px; background-color:gray; border-radius:50%;");
      text = document.createTextNode("Neutral");
    } else {  // unable to predict
      // circle.setAttribute("style", "height:10px; width:10px; border-width:1px; border-color:black; border-radius:50%;");
      circle.setAttribute("style", "height:10px; width:10px; border-width:2px; border-style:dotted; border-color:gray; border-radius:50%;");
      text = document.createTextNode("Unable to predict");
    }
    newDiv.appendChild(circle);
    label.appendChild(text);
    // newDiv.appendChild(label);
    
    // TODO: insertAfter(secondChild)
    parent.appendChild(newDiv);

    const feedback = document.createElement("div");
    feedback.setAttribute("style", "display:flex; align-items:center; justify-content:flex-end; color:gray;");
    
    const feedbackLabel = document.createElement("p");
    feedbackLabel.setAttribute("style", "width:fit-content; float:right; padding:5px;");
    const feedbackLabelPulse = document.createElement("span");
    feedbackLabelPulse.setAttribute("style", "font-weight:bold;")
    const feedbackLabelPulseText = document.createTextNode("Pulse:");
    feedbackLabelPulse.appendChild(feedbackLabelPulseText);
    const feedbackLabelText = document.createTextNode(" Was this correct?");
    feedbackLabel.appendChild(feedbackLabelPulse);
    feedbackLabel.appendChild(feedbackLabelText);
    feedback.appendChild(feedbackLabel);

    const feedbackFormYes = document.createElement("form");
    feedbackFormYes.setAttribute("style", "width:fit-content; float:right; padding:5px;");
    feedbackFormYes.addEventListener('submit', yesSubmit);
    const feedbackFormYesInput = document.createElement("input");
    feedbackFormYesInput.setAttribute("type", "submit");
    feedbackFormYesInput.setAttribute("value", "Yes");
    // feedbackFormYesInput.setAttribute("style", "color:gray; text-transform:uppercase; height:20px; border-radius:5px; border-color:gray; font-size: 10px;");
    feedbackFormYes.appendChild(feedbackFormYesInput);
    feedback.appendChild(feedbackFormYes);

    const feedbackFormNo = document.createElement("form");
    feedbackFormNo.setAttribute("style", "width:fit-content; float:right; padding:5px 0 5px 5px;");
    feedbackFormNo.addEventListener('submit', noSubmit);
    const feedbackFormNoInput = document.createElement("input");
    feedbackFormNoInput.setAttribute("type", "submit");
    feedbackFormNoInput.setAttribute("value", "No");
    // feedbackFormNoInput.setAttribute("style", "color:gray; text-transform:uppercase; height:20px; border-radius:5px; border-color:gray; font-size: 10px;");
    feedbackFormNo.appendChild(feedbackFormNoInput);
    feedback.appendChild(feedbackFormNo);
    
    // TODO: insertAfter(secondChild)
    parent.appendChild(feedback);

  }

  function postFeedback(correct) {
    correct = '';
    title = '';
    const xml = new XMLHttpRequest();
    const url=`http://localhost:5000/feedback?correct=${correct}&title=${title}&target=${target}`;
    xml.open("GET", url);
    xml.send();

    // TODO: verify success response
  }

  function yesSubmit(event) {
    event.preventDefault();
    postFeedback('yes');
  }

  function noSubmit(event) {
    event.preventDefault();
    postFeedback('no');
  }

  // TODO: verify that these class names work on other machines
  const results = document.getElementsByClassName('LC20lb');
  const target = document.getElementsByClassName('gLFyf gsfi')[0].value;

  console.log('Running model on ' + results.length + ' search results');
  console.log('Target: ' + target);

  for (var i = 0, l = results.length; i < l; i++) {
    var title = results[i].childNodes[0].textContent;
    if (title.endsWith(" ..."))
      title = title.slice(0, -4);

    console.log('i: ' + i + ', title: ' + title);

    postData(i, title, target);
  }
// }, false)
