function postData(title, target) {
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
  console.log(res);
}

function yesSubmit(event) {
  event.preventDefault();
  postFeedback('yes');
}

function noSubmit(event) {
  event.preventDefault();
  postFeedback('no');
}

const results = document.getElementsByClassName('LC20lb');
const target = document.getElementsByClassName('gLFyf gsfi')[0].value;

console.log('Running model on ' + results.length + ' search results');
console.log('Target: ' + target);

for (var i = 0, l = results.length; i < l; i++) {
  const title = results[i].childNodes[0].textContent;
  console.log('i: ' + i + ', title: ' + title);

  // TODO: update this specific result
  postData(title, target);

  const parent = results[i].parentElement.parentElement.parentElement; //.parentElement;
  // parent.setAttribute("style", "display:flex; flex-direction:row;")

  const newDiv = document.createElement("div");
  // newDiv.setAttribute("style", "display:flex; flex-direction:row; font-size:medium; width:20px;")
  newDiv.setAttribute("style", "position:absolute; left:-25px; top:32px; display:flex; flex-direction:row; align-items:center; font-size:medium;")
  const circle = document.createElement("div");
  const label = document.createElement("span");
  label.setAttribute("style", "color:gray")
  var text = null;
  if (i % 3 == 0) {
    circle.setAttribute("style", "height:10px; width:10px; background-color:green; border-radius:50%;");
    text = document.createTextNode("Positive");
  } else if (i % 3 == 1) {
    circle.setAttribute("style", "height:10px; width:10px; background-color:red; border-radius:50%;");
    text = document.createTextNode("Negative");
  } else {
    circle.setAttribute("style", "height:10px; width:10px; background-color:gray; border-radius:50%;");
    text = document.createTextNode("Neutral");
  }
  newDiv.appendChild(circle);
  label.appendChild(text);
  // newDiv.appendChild(label);
  
  parent.appendChild(newDiv);

  const feedback = document.createElement("div");
  feedback.setAttribute("style", "display:flex; align-items:center; justify-content:flex-end;")
  
  const feedbackLabel = document.createElement("p");
  feedbackLabel.setAttribute("style", "width:fit-content; float:right; padding:5px;")
  const feedbackLabelText = document.createTextNode("Pulse: Was this correct?");
  feedbackLabel.appendChild(feedbackLabelText);
  feedback.appendChild(feedbackLabel);

  const feedbackFormYes = document.createElement("form");
  feedbackFormYes.setAttribute("style", "width:fit-content; float:right; padding:5px;")
  feedbackFormYes.addEventListener('submit', yesSubmit);
  const feedbackFormYesInput = document.createElement("input");
  feedbackFormYesInput.setAttribute("type", "submit");
  feedbackFormYesInput.setAttribute("value", "Yes");
  feedbackFormYes.appendChild(feedbackFormYesInput);
  feedback.appendChild(feedbackFormYes);

  const feedbackFormNo = document.createElement("form");
  feedbackFormNo.setAttribute("style", "width:fit-content; float:right; padding:5px 0 5px 5px;")
  feedbackFormNo.addEventListener('submit', noSubmit);
  const feedbackFormNoInput = document.createElement("input");
  feedbackFormNoInput.setAttribute("type", "submit");
  feedbackFormNoInput.setAttribute("value", "No");
  feedbackFormNo.appendChild(feedbackFormNoInput);
  feedback.appendChild(feedbackFormNo);
  
  parent.appendChild(feedback);
}

