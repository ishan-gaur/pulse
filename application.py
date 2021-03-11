import os
from flask import Flask, render_template, request
import logging
import nltk
nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer


LOG_FILE = "flask_server.log"
if os.path.exists(LOG_FILE):
   os.remove(LOG_FILE)

app = Flask(__name__)
logging.basicConfig(filename=LOG_FILE, level=logging.DEBUG, format="%(asctime)s %(levelname)s : %(message)s")
sia = SentimentIntensityAnalyzer()


@app.route("/predict")
def predict_sentiment():
    title = request.args.get("title")
    target = request.args.get("target")
    if not title or not target:
        return "FAILURE, MISSING ARGUMENTS"
    labels = {"Negative": "neg", "Neutral": "neu", "Positive": "pos"}
    pol_score = sia.polarity_scores(title)
    sent = max(labels.keys(), key=(lambda x: pol_score[labels[x]]))
    print("Title: {0}, Target: {1}, Prediction: {2}".format(title, target, sent))
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

