import unicodedata
import re


def build_query(tokens):
    query = ''
    for token in tokens:
        token_str = get_token_string(token)
        print token_str
        token_str = get_normalized_string(token_str)

        if query == '':
            query = query + token_str
        else:
            query = query + '+' + token_str

    return query


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
