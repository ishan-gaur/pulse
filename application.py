import os
from os import path
import csv
from flask import Flask, render_template, request
from flask_cors import CORS
import logging
from distilbert import dbert_score, train_from_feedback, use_new_model, get_feedback_accuracy
from utils import combine_clean
# from vader import vader_score


LOG_FILE = "flask_server.log"
if os.path.exists(LOG_FILE):
   os.remove(LOG_FILE)

app = Flask(__name__)
CORS(app)
logging.basicConfig(filename=LOG_FILE, level=logging.DEBUG, format="%(asctime)s %(levelname)s : %(message)s")

print("READY")

"""
@app.route("/predict-old")
def predict_old():
    title = request.args.get("title")
    target = request.args.get("target")
    if not title or not target:
        return "FAILURE, MISSING ARGUMENTS"
    labels = ["Negative", "Neutral", "Positive"]
    sent = labels[random.randint(0, 2)]
    return sent

@app.route("/predict-vader")
def predict_vader():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    if not (title and snippet):
        return "FAILURE, MISSING ARGUMENTS"
    sent = vader_score(title, snippet)
    return sent
"""

@app.route("/predict")
def predict():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    if not (title and snippet):
        return "FAILURE, MISSING ARGUMENTS"
    sent = dbert_score(combine_clean(title, snippet))
    return sent

# TODO change to POST
user_feedback_log = "user-feedback.csv"
@app.route("/feedback")
def log_user_feedback():
    # TODO: error checking for the form entries?
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    str_to_label = {"negative": 0, "neutral": 1, "positive": 2}
    label = str_to_label[request.args.get("correct")]
    with open(user_feedback_log, "a") as f:
        writer = csv.writer(f)
        writer.writerow([combine_clean(title, snippet), label])
    return "RECORDED"

@app.route("/train")
def update_model():
    train_from_feedback(10)
    return str(use_new_model()) # TODO really should be a separate endpoint

@app.route("/accuracy-feedback")
def evaluate_model():
    return str(get_feedback_accuracy())
