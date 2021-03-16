ending_punc = [".", "!", "?", ",", ":", ";", "\"", "|"]
def clean(s):
    while s[-1] == " ":
        s = s[:-1]
    if not s[-1] in ending_punc:
        s = s + "."
    return s

def combine_clean(s, t):
    return clean(s) + " " + clean(t)

    
