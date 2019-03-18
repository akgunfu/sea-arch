from unidecode import unidecode
import re

WHITE_SPACE = " "
NEWLINE = "\n"
PLUS = "+"

SYMBOLS = ['-', ',', '.', '+', '/', '*', '#', '!', '?']


def build_query(question, choices, nlp):
    query = ''
    for choice in choices:
        query = add_choice(query, choice)
    query, used = add_question(query, question, nlp)
    return query, used


def add_choice(query, choice):
    if choice is not None:
        choice = beautify(choice)
        splits = choice.split(WHITE_SPACE)
        splits = filter(lambda x: x not in SYMBOLS, splits)
        choice_str = PLUS.join(splits)
        choice_str = enclose_quote(choice_str)
        if len(query) > 0:
            query = query + PLUS + choice_str
        else:
            query = query + choice_str
    return query


def add_question(query, question, nlp):
    if question is not None:
        question = beautify(question)
        question = process_question(question, nlp)
        question_str = get_normalized_string(question)
        if len(query) > 0:
            query = query + PLUS + question_str
        else:
            query = query + question_str
    return query, question


def process_question(question, nlp):
    has_keyword, keyword = extract_keyword(question, nlp)
    if has_keyword:
        question = keyword
    else:
        question = nlp
    return question


def extract_keyword(question, nlp):
    found_quote, quote = find_quote(question)
    if found_quote:
        return found_quote, quote
    found_upper, upper = find_uppercase_words(question, nlp)
    if found_upper:
        return found_upper, upper
    return False, question


def find_quote(question):
    start_index = question.find('\"')
    try:
        if start_index != -1:
            end_index = question.find('\"', start_index + 1)
            if start_index != -1 and end_index != -1:
                return True, question[start_index + 1: end_index + 1]
    except:
        print 'Quote text search failed'
    return False, question


def find_uppercase_words(question, nlp):
    tokens = question.split(WHITE_SPACE)
    keywords = []
    try:
        for i, token in enumerate(tokens):
            try:
                if token[0].isupper() or token[0].isdigit():
                    if i == 0:
                        if tokens[1][0].isupper():
                            keywords.append(token)
                    else:
                        keywords.append(token)
            except:
                pass
    except Exception as err:
        print str(err)
        print 'Uppercase text search failed'
    found = len(keywords) > 0
    merged = merge_keywords(keywords, nlp)
    uppercase = WHITE_SPACE.join(merged)
    return found, uppercase


def merge_keywords(keywords, nlp):
    nlp = unidecode(nlp)
    nlp = filter(lambda x: len(x) > 1, nlp.split(" "))

    _keywords = []
    for keyword in keywords:
        _keywords.append(keyword)

    for nlp_keyword in reversed(nlp):
        if len(_keywords) <= 5:
            normalized = WHITE_SPACE.join(keywords).lower()
            normalized = normalized.replace("'", "")
            if not nlp_keyword.lower() in normalized:
                _keywords.append(nlp_keyword)

    return _keywords

def get_normalized_string(token_str):
    token_str = unidecode(token_str)
    token_str = re.sub(r"[^\w\s]", '', token_str)
    token_str = re.sub(r"\s+", '+', token_str)
    return token_str


def beautify(value):
    if type(value) is str or type(value) is unicode:
        value = value.replace(".", " ")
        value = value.replace(",", " ")
        return value.replace(NEWLINE, WHITE_SPACE)
    return value


def enclose_quote(value):
    if type(value) is str or type(value) is unicode:
        return '"' + value + '"'
    raise ValueError("Cannot enclose value of no string type")
