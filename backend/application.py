import os

from flask import Flask, render_template, request
# TODO: Add logging and a route for feedback
import logging

from joblib import load
from model import load_glove, predict, default_save_location

# LOG_FILE = "flask_server.log"
# if os.path.exists(LOG_FILE):
   # os.remove(LOG_FILE)

app = Flask(__name__)
clf = load(default_save_location)
load_glove()

# logging.basicConfig(filename=LOG_FILE, level=logging.DEBUG, format='%(asctime)s %(levelname)s : %(message)s')

# TODO: shouldn't need this, but commented out just in case
# @app.route("/")
# def index():
#     return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict_sentiment():
    title = request.form['title']
    target = request.form['target']
    if not title or not target:
        return "FAILURE, MISSING ARGUMENTS"
    sent = "Positive" if predict(clf, title=title, target=target)[0] == 2 else "Negative"
    print("Title: {0}, Target: {1}, Prediction: {2}".format(title, target, sent))
    return sent
