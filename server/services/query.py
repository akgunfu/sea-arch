import unicodedata
from unidecode import unidecode
import re


def build_query(tokens, nlp):
    query = ''
    for i, token in enumerate(tokens):
        if i == 0:
            token_str = token
            #token_str = get_token_string(token)
            token_str = '"' + token_str + '"'
            query = query + token_str

        if i == 1:
            try:
                is_important, important = check_important_text(token)
                if is_important:
                    token = important
                else:
                    token = nlp
            except:
                print 'Error trying to extract important text'

            token_str = get_token_string(token)
            token_str = get_normalized_string(token_str)

            query = query + '+' + token_str

    return query


def check_important_text(question):
    found_quote, quote = find_quote(question)
    if found_quote:
        return found_quote, quote
    found_upper, upper = find_uppercase_words(question)
    if found_upper:
            return found_upper, upper
    return False, ""


def find_quote(question):
    start_index = question.find('\"')
    if start_index != -1:
        end_index = question.find('\"', start_index + 1)
        if start_index != -1 and end_index != -1:
            return True, question[start_index + 1: end_index + 1]
    return False, ""

def find_uppercase_words(question):
    question = question.replace("\n", " ")
    tokens = question.split(" ")
    special = []
    for i, token in enumerate(tokens):
        if token[0].isupper():
            if i == 0:
                if tokens[1][0].isupper():
                    special.append(token)
                else:
                    print 'Just sentence start'
            else:
                special.append(token)

    found = len(special) > 0
    uppercase = " ".join(special)
    return found, uppercase


def get_normalized_string(token_str):
    token_str = re.sub(r"[^\w\s]", '', token_str)
    token_str = re.sub(r"\s+", '+', token_str)
    return token_str


def get_token_string(token):
    if type(token) is str:
        token_str = token
    elif type(token) is unicode:
        token_str = unidecode(token)
    else:
        try:
            token_str = str(token)
        except:
            print 'Cannot get string value for token: ', token
            token_str = ''
    return token_str
