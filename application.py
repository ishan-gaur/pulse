from flask import Flask, render_template, request
import logging

app = Flask(__name__)

logging.basicConfig(filename='last_run.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s : %(message)s')

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/measure-pulse", methods=['POST'])
def measure_pulse():
    text = request.form.get("text")
    target = request.form.get("target")
    if not text or not target:
        return "Missing Input Fields!"
    app.logger.info("Recieved \"%s\" with target \"%s\"", text, target)
    sent_result = get_sentiment(text, target)
    return sent_result

def get_sentiment(text, target):
    # TODO add log of result: app.logger.info("Sentiment \"%s\" for text \"%s\" with target \"%s\"", sent, text, target)
    return render_template("sentiment-result.html", sent="Positive" if text[0] == target[0] else "Negative", text=text, target=target)
