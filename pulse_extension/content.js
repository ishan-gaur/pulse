const BASE_URL = "http://localhost:5000/"

// TODO: verify that these class names work on other machines
/* For "All" Search. */
// const results = document.getElementsByClassName("LC20lb");
// const target = document.getElementsByClassName("gLFyf gsfi")[0].value;

/* For "News" Search. */
const results = document.getElementsByClassName("JheGif nDgy9d");

console.log("Running model on " + results.length + " search results");

for (var i = 0, l = results.length; i < l; i++) {
  /* remove ellipses */
  var title = results[i].childNodes[0].textContent.replace(/\.{3,}/gi, "").replace("\n", " ")
  var snippet = results[i].parentElement.childNodes[2].childNodes[0].textContent.replace(/\.{3,}/gi, "").replace("\n", " ")

  console.log("i: " + i + ", title: " + title);
  console.log("snippet: " + snippet);

  getData(i, title, snippet);
}

/* ==================== HTTP HELPER FUNCTIONS ==================== */

function getData(i, title, snippet) {
  const xhr = new XMLHttpRequest();
  const url = `${BASE_URL}predict-news?title=${title}&snippet=${snippet}`;
  xhr.open("GET", url);
  xhr.send();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      showResponse(i, xhr.responseText, title);
    }
  }
}

// TODO: verify success response
function postFeedback(correct, _, title) {
  const xml = new XMLHttpRequest();
  const url = `${BASE_URL}feedback?\
              correct=${correct}&title=${title}&target=${target}`;
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
  const labelText = document.createTextNode(" Was this correct?");
  
  label.appendChild(labelPulse);
  label.appendChild(labelText);
  return label;
}

function createFeedbackFormButton(yes, res, title) {
  const button = document.createElement("form");
  // button.classList.add("pulse-feedback-label" + (yes ? "" : "-last"));
  button.classList.add("pulse-feedback-label");
  button.addEventListener("submit", (event) => {
    event.preventDefault();
    postFeedback(yes ? "yes" : "no", res, title);
  });

  const buttonInput = document.createElement("input");
  buttonInput.type = "submit";
  buttonInput.value = yes ? "Yes" : "No";
  
  button.appendChild(buttonInput);
  return button;
}

/* Create the feedback form. */
function createFeedbackForm(res, title) {
  const feedbackForm = document.createElement("div");
  feedbackForm.classList.add("pulse-feedback");

  feedbackForm.appendChild(createFeedbackFormLabel());
  feedbackForm.appendChild(createFeedbackFormButton(true, res, title));
  feedbackForm.appendChild(createFeedbackFormButton(false, res, title));

  return feedbackForm;
}

/* Get the parent element and append the new children elements. */
// TODO: insertAfter(secondChild)
function showResponse(i, res, title) {
  console.log(`Showing response ${i}: ${res}`);
  const parent = results[i].parentElement.parentElement.parentElement;
  parent.appendChild(createFeedbackForm(res, title));
  parent.appendChild(createCircle(res));
}
