import os
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


@app.route("/predict")
def predict_sentiment():
    title = request.args.get("title")
    target = request.args.get("target")
    if not title or not target:
        return "FAILURE, MISSING ARGUMENTS"
    labels = ["Negative", "Neutral", "Positive"]
    sent = labels[random.randint(0, 2)]
    return sent

@app.route("/predict-news")
def predict_sentiment_news():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    if not (title and snippet):
        return "FAILURE, MISSING ARGUMENTS"
    sent = vader_score(title, snippet)
    return sent

# TODO change to POST
@app.route("/feedback")
def log_user_feedback():
    # TODO: error checking for the form entries?
    title = request.args.get("title")
    target = request.args.get("target")
    correct = True if request.args.get('correct') == "yes" else False
    sent = 1 if predict(clf, title=title, target=target)[0] == 2 else -1
    if not correct: sent *= -1
    app.logger.info("Title: {0}, Target: {1}, Correct_Target: {2}".format(title, target, sent))
    return "recorded"

