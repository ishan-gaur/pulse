from collections import Counter
from datasets import load_dataset
from transformers import pipeline
from sklearn.metrics import balanced_accuracy_score as score
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt

SEED = 12345
VANILLA_MODEL = "distilbert-base-uncased"
TRAINED_MODEL = "distilbert-base-uncased-finetuned-persent-5"
FINETUNED_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
MODEL = TRAINED_MODEL
TOKENIZER = FINETUNED_MODEL
DATASET = "per_sent"

print("Loading Model")
classifier = pipeline('sentiment-analysis', model=MODEL, tokenizer=TOKENIZER)
# labels = {"POSITIVE": 2, "NEUTRAL": 1, "NEGATIVE": 0}
labels = {"POSITIVE": 1, "NEGATIVE": 0}


def predict(snippet):
    output = classifier(snippet)
    predictions = []
    for i in range(len(output)):
        predictions.append(labels[output[i]["label"]])
        """
        if abs(output[i]["score"] - 0.5) < 0.15:
            predictions.append(labels["NEUTRAL"])
        else:
            predictions.append(labels[output[i]["label"]])
        """
    return predictions


def calibration(data):
    output = classifier(data["input"])
    print(output)
    y_pred = []
    y_true = data["target"]
    for i in range(len(output)):
        y_pred.append(output[i]["score"] if output[i]["label"] == "POSITIVE" else (1 - output[i]["score"]))
    for i in range(len(y_true)):
        y_true[i] /= 2
    prob_true, prob_pred = calibration_curve(y_true, y_pred, n_bins=20)
    plt.plot(prob_pred, prob_true)
    plt.show()


def get_data(dataset):
    data = {}
    for key in dataset.keys():
        input = []
        target = []
        for datapoint in dataset[key]:
            if datapoint["TRUE_SENTIMENT"] == -1: continue
            if datapoint["TRUE_SENTIMENT"] == 1: continue
            input.append(datapoint["TITLE"])
            target.append(datapoint["TRUE_SENTIMENT"])
        data[key] = {"input": input, "target": target}
    return data


def eval(data):
    print(Counter(data["target"]))
    print(score(data["target"], [predict(s) for s in data["input"]]))


print("Loading data")
dataset = load_dataset(DATASET)
data = get_data(dataset)
"""
entire_data = {"input": [], "target": []}
for key in data.keys():
    for part in data[key].keys():
        entire_data[part].extend(data[key][part])
"""
calibration(data["test_random"])
eval(data["test_random"])
print(classifier("Georgia bill is going to be terrible for voters."))
