// alert("Hello from Pulse!");

const elements = document.getElementsByClassName('LC20lb');
const input = document.getElementsByClassName('gLFyf gsfi')[0];
const target = input.value;

console.log('Running model on ' + elements.length + ' search results');
console.log('Target: ' + target);

for (var i = 0, l = elements.length; i < l; i++) {
  // elements[i].style.color = 'green';
  // var child = elements[i].childNodes[0];
  // var para = document.createElement("div");
  // var node = document.createTextNode("This is a new paragraph.");
  // // para.style.color = 'green';
  // elements[i].insertBefore(node, child);

  const parent = elements[i].parentElement.parentElement.parentElement; //.parentElement;
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
  
  // const child = parent.childNodes[0];
  // parent.insertBefore(newDiv, child);
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
  const feedbackFormYesInput = document.createElement("input");
  feedbackFormYesInput.setAttribute("type", "submit");
  feedbackFormYesInput.setAttribute("value", "Yes");
  feedbackFormYes.appendChild(feedbackFormYesInput);
  feedback.appendChild(feedbackFormYes);

  const feedbackFormNo = document.createElement("form");
  feedbackFormNo.setAttribute("style", "width:fit-content; float:right; padding:5px 0 5px 5px;")
  const feedbackFormNoInput = document.createElement("input");
  feedbackFormNoInput.setAttribute("type", "submit");
  feedbackFormNoInput.setAttribute("value", "No");
  feedbackFormNo.appendChild(feedbackFormNoInput);
  feedback.appendChild(feedbackFormNo);
  
  parent.appendChild(feedback);
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   postData(request)
//   sendResponse({ classification: "pro" })
// })