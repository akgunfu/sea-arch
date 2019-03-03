import unicodedata
import re


def build_query(tokens, nlp):
    query = ''
    for i, token in enumerate(tokens):
        if i == 0:
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

        if query == '':
            query = query + token_str
        else:
            query = query + '+' + token_str

    return query


def check_important_text(question):
    start_index = question.find('\"')
    if start_index != -1:
        end_index = question.find('\"', start_index + 1)
        if start_index != -1 and end_index != -1:
            return True, question[start_index + 1: end_index + 1]
    return False, ""


def get_normalized_string(token_str):
    token_str = re.sub(r"[^\w\s]", '', token_str)
    token_str = re.sub(r"\s+", '+', token_str)
    return token_str


def get_token_string(token):
    if type(token) is str:
        token_str = token
    elif type(token) is unicode:
        token_str = unicodedata.normalize('NFKD', token).encode('ascii', 'ignore')
    else:
        try:
            token_str = str(token)
        except:
            print 'Cannot get string value for token: ', token
            token_str = ''
    return token_str
