from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
from transformers import Trainer, TrainingArguments
from datasets import load_dataset
import torch
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.metrics import balanced_accuracy_score as score

FINETUNED_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
MODEL = FINETUNED_MODEL
TOKENIZER = FINETUNED_MODEL

model = AutoModelForSequenceClassification.from_pretrained(MODEL)
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER, use_fast=True)
classifier = pipeline('sentiment-analysis', model=model, tokenizer=tokenizer)
labels = {"POSITIVE": "Positive", "NEUTRAL": "Neutral", "NEGATIVE": "Negative"}

def classify(snippet):
    output = classifier(snippet)
    if abs(output[0]["score"] - 0.5) < 0.4:
        return (labels["NEUTRAL"], 1 - 2 * abs(output[0]["score"] - 0.5))
    return (labels[output[0]["label"]], output[0]["score"])

def dbert_score_sep(title, snippet):
    title_class = classify(title)
    snippet_class = classify(snippet)
    print(title, title_class, snippet_class)
    if snippet_class[0] == "Neutral" or title_class[0] == "Neutral":
        return "Neutral"
    return snippet_class[0] if snippet_class[1] >= title_class[1] else title_class[0]

def dbert_score(text):
    score = classify(text)
    return score[0]

def relabel(batch):
    for i in range(len(batch['label'])):
        batch['label'][i] = batch['label'][i] / 2
    return batch

def tokenize(batch):
    return tokenizer(batch['text'], padding=True, truncation=True) # creates the input_ids and attention_mask columns

    
def tokenize_and_relabel(batch):
    batch = relabel(batch)
    return tokenize(batch)

def dataset_preprocessing(dataset):
    dataset = dataset.filter(lambda example: example['label'] != 1 and example['label'] != -1) #TODO make this thing multiclass!
    dataset = dataset.map(tokenize_and_relabel, batched=True, batch_size=len(dataset))
    dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])
    return dataset

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }


user_feedback_log = "user-feedback.csv"
columns = ["text", "label"]
def load_feedback(file_name=user_feedback_log):
    data_files = {"train": file_name}
    train_dataset = load_dataset("csv", data_files=data_files, column_names=columns, download_mode="force_redownload")
    return dataset_preprocessing(train_dataset["train"])

SAVE_LOCATION = "dbert-sst-finetuned-feedback"
def train_from_feedback(epochs=1):
    train_data = load_feedback()
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=epochs,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        compute_metrics=compute_metrics,
        train_dataset=train_data
    )

    trainer.train()
    model.save_pretrained(SAVE_LOCATION)
    return "MODEL UPDATED"

def use_new_model():
    global model
    global classifier
    model = AutoModelForSequenceClassification.from_pretrained(SAVE_LOCATION)
    classifier = pipeline('sentiment-analysis', model=model, tokenizer=tokenizer)
    return get_feedback_accuracy(classifier)

def get_feedback_accuracy(classifier=classifier):
    labels = {"NEGATIVE": 0, "NEUTRAL": 1, "POSITIVE": 2}
    data_files = {"train": user_feedback_log}

    dataset = load_dataset("csv", data_files=data_files, column_names=columns, download_mode="force_redownload")
    dataset = dataset["train"]
    dataset = dataset.map(tokenize, batched=True, batch_size=len(dataset))
    dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])

    output = classifier(dataset['text'])
    predictions = []
    for i in range(len(output)):
        # predictions.append(labels[output[i]["label"]])
        if abs(output[i]["score"] - 0.5) < 0.3:
            predictions.append(labels["NEUTRAL"])
        else:
            predictions.append(labels[output[i]["label"]])
    return score(dataset["label"], predictions)
    
