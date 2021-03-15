import os
import csv
from flask import Flask, render_template, request
from flask_cors import CORS
import logging
from vader import vader_score


LOG_FILE = "flask_server.log"
if os.path.exists(LOG_FILE):
   os.remove(LOG_FILE)

app = Flask(__name__)
CORS(app)
logging.basicConfig(filename=LOG_FILE, level=logging.DEBUG, format="%(asctime)s %(levelname)s : %(message)s")


@app.route("/predict-old")
def predict_sentiment():
    title = request.args.get("title")
    target = request.args.get("target")
    if not title or not target:
        return "FAILURE, MISSING ARGUMENTS"
    labels = ["Negative", "Neutral", "Positive"]
    sent = labels[random.randint(0, 2)]
    return sent

@app.route("/predict-vader")
def predict_sentiment_news():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    if not (title and snippet):
        return "FAILURE, MISSING ARGUMENTS"
    sent = vader_score(title, snippet)
    return sent

@app.route("/predict")
def predict_sentiment_news():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    if not (title and snippet):
        return "FAILURE, MISSING ARGUMENTS"
    sent = dbert_score(title, snippet)
    return sent

# TODO change to POST
user_feedback_log = "user-feedback.csv"
@app.route("/feedback")
def log_user_feedback():
    # TODO: error checking for the form entries?
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    label = request.args.get("label")
    with open(user_feedback_log, "a") as f:
        writer = csv.writer(f)
        writer.writerow([title, snippet, label])
    return "RECORDED"

