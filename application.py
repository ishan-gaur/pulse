import os
import csv
from flask import Flask, render_template, request
from flask_cors import CORS
import logging
from distilbert import dbert_score, train_from_feedback, use_new_model, get_feedback_accuracy
from utils import combine_clean


LOG_FILE = "flask_server.log"
if os.path.exists(LOG_FILE):
   os.remove(LOG_FILE)

app = Flask(__name__)
CORS(app)
logging.basicConfig(filename=LOG_FILE, level=logging.DEBUG, format="%(asctime)s %(levelname)s : %(message)s")

print("READY")

@app.route("/predict")
def predict():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    if not (title and snippet):
        return "FAILURE: MISSING ARGUMENTS"
    sent = dbert_score(combine_clean(title, snippet))
    return sent

# TODO change to POST
user_feedback_log = "user-feedback.csv"
@app.route("/feedback")
def log_user_feedback():
    title = request.args.get("title")
    snippet = request.args.get("snippet")
    correct = request.args.get("correct")
    if not (title and snippet and correct):
        return "FAILURE: MISSING ARGUMENTS"
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
