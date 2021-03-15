import nltk
nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()
labels = {"Negative": "neg", "Neutral": "neu", "Positive": "pos"}

def select_polarity(neg, neu, pos):
    max_score = max([neg, neu, pos])
    if max_score == neu:
        if max_score > 0.8:
            return "Neutral"
    # TODO add something here to default to neutral if the difference between negative and positive are small?
    return "Negative" if neg > pos else "Positive"

def vader_score(title, snippet):
    title_score = sia.polarity_scores(title)
    title_sent = select_polarity(title_score["neg"], title_score["neu"], title_score["pos"])
    snip_score = sia.polarity_scores(snippet)
    snip_sent = select_polarity(snip_score["neg"], snip_score["neu"], snip_score["pos"])
    sent = snip_sent
    if snip_sent != title_sent:
        if snip_sent == "Neutral":
            sent = title_sent
        elif title_sent != "Neutral":
            sent = title_sent if title_score[labels[title_sent]] > snip_score[labels[snip_sent]] else snip_sent
    print("Title: {0}, Snippet: {1}, Prediction: {2}\n\
            \tFrom title:\n\t\tNegative: {3}, Neutral: {4}, Positive: {5}\n\
            \tFrom snip:\n\t\tNegative: {6}, Neutral: {7}, Positive: {8}".format(
        title, snippet, sent, 
        title_score["neg"], title_score["neu"], title_score["pos"],
        snip_score["neg"], snip_score["neu"], snip_score["pos"]))
    return sent

