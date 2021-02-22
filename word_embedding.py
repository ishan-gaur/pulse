import numpy as np
from joblib import dump, load
from datasets import load_dataset
from sklearn.linear_model import LogisticRegression
import json

embeddings_dict = {}

# TODO: Need the appropriate auto loading of the model upon import so that predict is an instant operation
# TODO: Also need to get the glove loading right
# Application should just load model and embedding on creation (pretrained) and then predict on POST to /measure-pulse
def word_embedding(str, title):
    # input is title and target
    # pad title (20 words) and target (10 words)
    # transform title and target into word embeddings w glove
    if title:
        title_embedding = []
        for title_word in str.split():
            if len(title_embedding) < 20:
                break
            elif title_word.lower() in embeddings_dict:
                title_word_embedding = embeddings_dict[title_word.lower()]
                title_word_embedding = np.append(title_word_embedding, 0)
                title_embedding.append(title_word_embedding)
        while len(title_embedding) < 20:
            title_word_embedding = embeddings_dict["unk"]
            title_word_embedding = np.append(title_word_embedding, 1)
            title_embedding.append(title_word_embedding)
        return np.asarray(title_embedding)

    else:
        target_embedding = []
        for target_word in str.split():
            if len(target_embedding) < 20:
                break
            elif target_word.lower() in embeddings_dict:
                target_word_embedding = embeddings_dict[target_word.lower()]
                target_word_embedding = np.append(target_word_embedding, 0)
                target_embedding.append(target_word_embedding)
        while len(target_embedding) < 10:
            target_word_embedding = embeddings_dict["unk"]
            target_word_embedding = np.append(target_word_embedding, 1)
            target_embedding.append(target_word_embedding)
        return np.asarray(target_embedding)

def load_glove():
    # load glove embeddings
    with open("glove.6B/glove.6B.50d.txt", 'r', encoding="utf-8") as f:
        for line in f:
            values = line.split()
            word = values[0]
            vector = np.asarray(values[1:], "float32")
            embeddings_dict[word] = vector

def train():
    titles = []
    targets = []
    y = []

    dataset = load_dataset("per_sent")
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
    print(y)

    clf = LogisticRegression().fit(np.asarray(X), np.asarray(y))
    return clf

# TODO: definitely need to get rid of these, just here as placeholders
default_save_location = 'sentiment-model.joblib'
def train_and_save_model():
    clf = train()
    dump(clf, default_save_location) 

def sentiment_inference_from_saved(model_file=default_save_location, title=None, target=None):
    clf = load(model_file)
    load_glove()
    return predict(clf, title, target)

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

def main():
    """
    load_glove()
    clf = train()
    test(clf)
    predict("title", "target")
    """
    load_glove()
    train_and_save_model()
    # print(sentiment_inference_from_saved(title="title", target="target"))

if __name__ == "__main__": main()
