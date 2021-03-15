import nltk
nltk.download('vader_lexicon')
import sklearn
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from datasets import load_dataset
from collections import Counter
from sklearn.metrics import balanced_accuracy_score

SEED = 12345
DATASET = "per_sent"
sia = SentimentIntensityAnalyzer()

def predict(snippet):
    pol_score = sia.polarity_scores(snippet)
    neg, neu, pos = pol_score["neg"], pol_score["neu"], pol_score["pos"]
    max_score = max([neg, neu, pos])
    if max_score == neu:
        if max_score > 0.9:
            return 1
    return 0 if neg > pos else 2


def get_data(dataset):
    data = {}
    for key in dataset.keys():
        input = []
        target = []
        for datapoint in dataset[key]:
            if datapoint["TRUE_SENTIMENT"] == -1: continue
            # input.append(" ".join([datapoint["TARGET_ENTITY"], datapoint["TITLE"]]))
            # target.append(datapoint["TRUE_SENTIMENT"])
            for i, p in enumerate(datapoint["MASKED_DOCUMENT"].split('\n')):
                if i > 15: break
                if datapoint["Paragraph" + str(i)] == -1: continue
                # input.append(" ".join([datapoint["TARGET_ENTITY"], p]))
                input.append(p)
                target.append(datapoint["Paragraph" + str(i)])
        data[key] = {"input": input, "target": target}
    return data


print("Loading data")
dataset = load_dataset(DATASET)
data = get_data(dataset)

print(Counter(data["train"]["target"]))
print(Counter(data["validation"]["target"]))
print(balanced_accuracy_score(data["validation"]["target"], [predict(s) for s in data["validation"]["input"]]))
print(Counter(data["test_fixed"]["target"]))
print(balanced_accuracy_score(data["test_fixed"]["target"], [predict(s) for s in data["test_fixed"]["input"]]))
print(Counter(data["test_random"]["target"]))
print(balanced_accuracy_score(data["test_random"]["target"], [predict(s) for s in data["test_random"]["input"]]))
