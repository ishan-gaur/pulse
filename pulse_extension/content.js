const BASE_URL = "http://localhost:5000/";

/* Wait for content to load. */
setTimeout(function () {
  // TODO: verify that these class names work on other machines
  /* For "All" Search. */
  // const results = document.getElementsByClassName("LC20lb");
  // const target = document.getElementsByClassName("gLFyf gsfi")[0].value;

  /* For "News" Search. */
  const results = document.getElementsByClassName("JheGif nDgy9d");
  // const target = document.getElementsByClassName("gsfi")[0].value;

  console.log("Running model on " + results.length + " search results");
  // console.log("Target: " + target);

  tempFunc(results, 0);

  // for (var i = 0; i < results.length; i++) {
  //   /* Remove ellipses. */
  //   var title = results[i].childNodes[0].textContent.replace(/\.{3,}/gi, "");
  //   var snippet = results[i].parentElement.childNodes[2].childNodes[0]
  //                 .textContent;

  //   console.log("i: " + i + ", title: " + title);
  //   console.log("snippet: " + snippet);

  //   postData(i, results, target, title, snippet);
  // }
// TODO: this timeout number is arbitrary...
}, 100);

/* Calls postData serially. */
function tempFunc(results, i) {
  if (i == results.length)
    return;
  
  /* Remove ellipses. */
  var title = results[i].childNodes[0].textContent.replace(/\.{3,}/gi, "");
  var snippet = results[i].parentElement.childNodes[2].childNodes[0]
                .textContent;

  console.log("i: " + i + ", title: " + title);
  console.log("snippet: " + snippet);

  postData(i, results, "", title, snippet);
}

/* ==================== HTTP HELPER FUNCTIONS ==================== */

function postData(i, results, _, title, snippet) {
  const xhr = new XMLHttpRequest();
  const url = `${BASE_URL}predict?title=${title}&snippet=${snippet}`;
  xhr.open("GET", url);
  xhr.send();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      showResponse(i, results, xhr.responseText, title, snippet);
      tempFunc(results, i + 1);
    }
  }
}

// TODO: verify success response
function postFeedback(correct, _, title, snippet) {
  const xml = new XMLHttpRequest();
  const url = `${BASE_URL}feedback?title=${title}&snippet=${snippet}&correct=${correct}`;
  xml.open("GET", url);
  xml.send();
}

/* ==================== HTML HELPER FUNCTIONS ==================== */

/* Create the colored dot. */
function createCircle(res) {
  const circle = document.createElement("div");
  circle.classList.add("pulse-circle");
  if (res === "Positive") {
    circle.classList.add("pulse-circle-positive");
  } else if (res === "Negative") {
    circle.classList.add("pulse-circle-negative");
  } else if (res === "Neutral") {
    circle.classList.add("pulse-circle-neutral");
  } else {                        // unable to predict
    circle.classList.add("pulse-circle-no-prediction");
  }
  return circle;
}

/* Create "Pulse: Was this correct?" label. */
function createFeedbackFormLabel() {
  const label = document.createElement("p");
  label.classList.add("pulse-feedback-label");
  
  const labelPulse = document.createElement("span");
  labelPulse.classList.add("pulse-feedback-label-pulse");

  const labelPulseText = document.createTextNode("Pulse:");
  labelPulse.appendChild(labelPulseText);
  const labelText = document.createTextNode(" What was the correct label?");
  
  label.appendChild(labelPulse);
  label.appendChild(labelText);
  return label;
}

function createFeedbackFormButton(correct, res, title, snippet) {
  const button = document.createElement("form");
  // button.classList.add("pulse-feedback-label" + (yes ? "" : "-last"));
  button.classList.add("pulse-feedback-label");
  button.addEventListener("submit", (event) => {
    event.preventDefault();
    postFeedback(correct.toLowerCase(), res, title, snippet);
  });

  const buttonInput = document.createElement("input");
  buttonInput.type = "submit";
  buttonInput.value = correct;
  
  button.appendChild(buttonInput);
  return button;
}

/* Create the feedback form. */
function createFeedbackForm(res, title, snippet) {
  const feedbackForm = document.createElement("div");
  feedbackForm.classList.add("pulse-feedback");

  feedbackForm.appendChild(createFeedbackFormLabel());
  feedbackForm.appendChild(
    createFeedbackFormButton("Positive", res, title, snippet));
  feedbackForm.appendChild(
    createFeedbackFormButton("Neutral", res, title, snippet));
  feedbackForm.appendChild(
    createFeedbackFormButton("Negative", res, title, snippet));

  return feedbackForm;
}

function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

/* Get the parent element and append the new children elements. */
// TODO: insertAfter(secondChild)
function showResponse(i, results, res, title, snippet) {
  console.log(`Showing response ${i}: ${res}`);
  // const parent = results[i].parentElement.parentElement.parentElement;
  const parent = findAncestor(results[i], "nChh6e").parentElement;
  
  // parent.appendChild(createCircle(res));
  parent.insertBefore(createCircle(res), parent.childNodes[0]);
  parent.appendChild(createFeedbackForm(res, title, snippet));
}
