from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

FINETUNED_MODEL = "distilbert-base-uncased-finetuned-sst-2-english"
MODEL = FINETUNED_MODEL
TOKENIZER = FINETUNED_MODEL

model = AutoModelForSequenceClassification.from_pretrained(MODEL)
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER, use_fast=True)
classifier = pipeline('sentiment-analysis', model=MODEL, tokenizer=TOKENIZER)
labels = {"POSITIVE": "Positive", "NEUTRAL": "Neutral", "NEGATIVE": "Negative"}

def classify(snippet):
    output = classifier(snippet)
    if abs(output[0]["score"] - 0.5) < 0.4:
        return (labels["NEUTRAL"], 1 - 2 * abs(output[0]["score"] - 0.5))
    return (labels[output[0]["label"]], output[0]["score"])

def dbert_score(title, snippet):
    title_class = classify(title)
    snippet_class = classify(snippet)
    print(title, title_class, snippet_class)
    if snippet_class[0] == "Neutral" or title_class[0] == "Neutral":
        return "Neutral"
    return snippet_class[0] if snippet_class[1] >= title_class[1] else title_class[0]
