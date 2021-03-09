// alert("Hello from Pulse!");

// var elements = document.getElementsByClassName('LC20lb DKV0Md');
var elements = document.getElementsByClassName('LC20lb');
// var elements = document.getElementsByClassName('g');

console.log(elements.length + ' elements');

for (var i = 0, l = elements.length; i < l; i++) {
  // elements[i].style.color = 'green';
  // var child = elements[i].childNodes[0];
  // var para = document.createElement("div");
  // var node = document.createTextNode("This is a new paragraph.");
  // // para.style.color = 'green';
  // elements[i].insertBefore(node, child);

  const parent = elements[i].parentElement.parentElement.parentElement.parentElement;
  parent.setAttribute("style", "display:flex; flex-direction:row;")

  const newDiv = document.createElement("div");
  newDiv.setAttribute("style", "display:flex; flex-direction:row; align-items:center; font-size:medium; width:20px;")
  const circle = document.createElement("div");
  var label = null;
  if (i % 3 == 0) {
    circle.setAttribute("style", "height:10px; width:10px; background-color:green; border-radius:50%; margin-right:5px;");
    label = document.createTextNode("Positive");
  } else if (i % 3 == 1) {
    circle.setAttribute("style", "height:10px; width:10px; background-color:red; border-radius:50%; margin-right:5px;");
    label = document.createTextNode("Negative");
  } else {
    circle.setAttribute("style", "height:10px; width:10px; background-color:gray; border-radius:50%; margin-right:5px;");
    label = document.createTextNode("Neutral");
  }
  newDiv.appendChild(circle);
  // newDiv.appendChild(label);
  
  const child = parent.childNodes[0];
  // parent.appendChild(newDiv);
  parent.insertBefore(newDiv, child);
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   postData(request)
//   sendResponse({ classification: "pro" })
// })