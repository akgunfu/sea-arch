from common import DEFAULT_ENCODING, TEXT_SEARCH_URL, decode
from request import do_request, do_request_simple
from soup_parser import parse_text_search_result, parse_query_search_result

from requests.utils import quote

def do_search_texts(query, keywords):
    try:
        url = build_url(query)
        html = do_request(url)
        must_include = list(keywords.values())
        return parse_text_search_result(html, must_include)
    except Exception as err:
        print "An error occurred while fetching url: " + str(err)
        return 0, [], []

def do_search_top(query):
    try:
        url = build_url(query)
        html = do_request_simple(url)
        return parse_query_search_result(html)
    except Exception as err:
        print "An error occurred while fetching url: " + str(err)
        return 0, []


def build_url(query):
    url = TEXT_SEARCH_URL + query
    encoded = url.encode(DEFAULT_ENCODING)
    print encoded
    return encoded
