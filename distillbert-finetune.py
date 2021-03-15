from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset
import torch
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def tokenize_and_relabel(batch):
    for i in range(len(batch['TRUE_SENTIMENT'])):
        batch['TRUE_SENTIMENT'][i] = batch['TRUE_SENTIMENT'][i] / 2
    return tokenizer(batch['TITLE'], padding=True, truncation=True) # creates the input_ids and attention_mask columns

def dataset_preprocessing(dataset):
    UNEEDED_COLUMNS = dataset.column_names
    UNEEDED_COLUMNS.remove('TITLE')
    UNEEDED_COLUMNS.remove('TRUE_SENTIMENT')
    dataset = dataset.filter(lambda example: example['TRUE_SENTIMENT'] != 1 and example['TRUE_SENTIMENT'] != -1) #TODO make this thing multiclass!
    dataset = dataset.map(tokenize_and_relabel, batched=True, batch_size=len(dataset), remove_columns=UNEEDED_COLUMNS)
    dataset = dataset.rename_column('TITLE', 'text')
    dataset = dataset.rename_column('TRUE_SENTIMENT', 'label')
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

MODEL = "distilbert-base-uncased"
TRAINED_MODEL = "distilbert-base-uncased-finetuned-persent"
FINETUNED_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
DATASET = "per_sent"

print("Loading Model and Tokenizer")
model = AutoModelForSequenceClassification.from_pretrained(FINETUNED_MODEL)
tokenizer = AutoTokenizer.from_pretrained(FINETUNED_MODEL)

print("Loading dataset, splitting, and formatting for training")
train_dataset, test_dataset = load_dataset(DATASET, split=['train+validation', 'test_fixed'])
train_dataset = dataset_preprocessing(train_dataset)
test_dataset = dataset_preprocessing(test_dataset)

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=1,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
)

trainer = Trainer(
    model=model,
    args=training_args,
    compute_metrics=compute_metrics,
    train_dataset=train_dataset,
    eval_dataset=test_dataset
)

print("Training")
trainer.train()
model.save_pretrained(TRAINED_MODEL)
