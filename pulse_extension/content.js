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

  const parent = elements[i].parentElement.parentElement; //.parentElement.parentElement;
  // parent.setAttribute("style", "display:flex; flex-direction:row;")

  const newDiv = document.createElement("div");
  // newDiv.setAttribute("style", "display:flex; flex-direction:row; font-size:medium; width:20px;")
  newDiv.setAttribute("style", "position:absolute; left:-100px; top:25px; display:flex; flex-direction:row; align-items:center; font-size:medium;")
  const circle = document.createElement("div");
  const label = document.createElement("span");
  label.setAttribute("style", "color:gray")
  var text = null;
  if (i % 3 == 0) {
    circle.setAttribute("style", "height:10px; width:10px; background-color:green; border-radius:50%; margin-right:5px;");
    text = document.createTextNode("Positive");
  } else if (i % 3 == 1) {
    circle.setAttribute("style", "height:10px; width:10px; background-color:red; border-radius:50%; margin-right:5px;");
    text = document.createTextNode("Negative");
  } else {
    circle.setAttribute("style", "height:10px; width:10px; background-color:gray; border-radius:50%; margin-right:5px;");
    text = document.createTextNode("Neutral");
  }
  newDiv.appendChild(circle);
  label.appendChild(text);
  newDiv.appendChild(label);
  
  // const child = parent.childNodes[0];
  // parent.insertBefore(newDiv, child);
  parent.appendChild(newDiv);
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   postData(request)
//   sendResponse({ classification: "pro" })
// })