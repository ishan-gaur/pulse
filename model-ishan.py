import numpy as np
from joblib import dump, load
from datasets import load_dataset
from collections import Counter
from sklearn.metrics import balanced_accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC as clf
from sklearn.feature_extraction.text import TfidfVectorizer
import json

SEED = 12345
DATASET = "per_sent"
default_save_location_model = 'sentiment-model.joblib'
default_save_location_vectorizer = 'sentiment-vectorizer.joblib'
embeddings_dict = {}

def train_embedding(data):
    vectorizer = TfidfVectorizer()
    vectorizer.fit(data["train"]["input"])
    dump(vectorizer, default_save_location_vectorizer) 
    return vectorizer

def setup():
    # train, validation, test_fixed, test_random
    print("Loading data")
    dataset = load_dataset(DATASET)
    data = {}

    print("Separating datasets")
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
    print(data["train"]["input"][:10], data["train"]["target"][:10])

    print("Vectorizing")
    vectorizer = train_embedding(data)
    for key in data.keys(): 
        data[key]["input"] = vectorizer.transform(data[key]["input"])
    
    print("Training Model")
    model = clf()
    model.fit(data["train"]["input"], data["train"]["target"])

    print(Counter(data["train"]["target"]))
    print(Counter(data["validation"]["target"]))
    print(balanced_accuracy_score(data["validation"]["target"], model.predict(data["validation"]["input"])))
    print(Counter(data["test_fixed"]["target"]))
    print(balanced_accuracy_score(data["test_fixed"]["target"], model.predict(data["test_fixed"]["input"])))
    print(Counter(data["test_random"]["target"]))
    print(balanced_accuracy_score(data["test_random"]["target"], model.predict(data["test_random"]["input"])))

    dump(model, default_save_location_model) 
    
setup()


"""
def train_embeddings():
vectorizer = TfidfVectorizer()
training_texts, validation_texts, training_labels, validation_labels =  train_test_split(
  train_texts, train_labels, test_size=0.1, random_state=SEED)
X_train = vectorizer.fit_transform(training_texts)
X_validation = vectorizer.transform(validation_texts)
X_test = vectorizer.transform(test_texts)

C_search = [0.1, 1.0, 3.0, 5.0, 7.0, 10.0]
accuracy = (0, 0)
best_model = None
for C in C_search:
  lr_model = sklearn.linear_model.LogisticRegression(C=C, max_iter=250)
  lr_model.fit(X_train, training_labels)
  validation_accuracy = accuracy_score(validation_labels, lr_model.predict(X_validation))
  testing_accuracy = accuracy_score(test_labels, lr_model.predict(X_test))
  if validation_accuracy > accuracy[0]: 
    accuracy = (validation_accuracy, testing_accuracy)
    best_model = lr_model
  print(f"C={C}: ", validation_accuracy)
print("Test Split Accuracy: ", accuracy[1])
lr_model = best_model

def train():
    titles = []
    targets = []
    y = []

    for datapoint in dataset['train']:
        if datapoint['TRUE_SENTIMENT'] != -1:
            titles.append(word_embedding(datapoint['TITLE'], True))
            targets.append(word_embedding(datapoint['TARGET_ENTITY'], False))
            y.append(datapoint['TRUE_SENTIMENT'])

    X = []
    for index in range(len(titles)):
        X.append(np.concatenate((titles[index], targets[index])))

    X = np.asarray(X)
    X = X.reshape(X.shape[0], X.shape[1] * X.shape[2])

    clf = LogisticRegression().fit(np.asarray(X), np.asarray(y))
    return clf

def train_and_save_model():
    clf = train()
    dump(clf, default_save_location) 

def test(clf):
    titles = []
    targets = []
    y = []

    dataset = load_dataset("per_sent")
    for datapoint in dataset['test_random']:
        if datapoint['TRUE_SENTIMENT'] != -1:
            titles.append(word_embedding(datapoint['TITLE'], True))
            targets.append(word_embedding(datapoint['TARGET_ENTITY'], False))
            y.append(datapoint['TRUE_SENTIMENT'])

    X = []
    for index in range(len(titles)):
        X.append(np.concatenate((titles[index], targets[index])))

    X = np.asarray(X)
    X = X.reshape(X.shape[0], X.shape[1] * X.shape[2])
    print(clf.score(X, y))

def predict(clf=None, title=None, target=None):
    title_embedding = word_embedding(title, True)
    target_embedding = word_embedding(target, False)
    full_embedding = np.concatenate((title_embedding, target_embedding))
    return clf.predict(full_embedding.flatten().reshape(1, -1))
"""

