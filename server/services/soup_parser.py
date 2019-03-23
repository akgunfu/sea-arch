from common import decode
import re
from bs4 import BeautifulSoup


def parse_text_search_result(html, must_include=None):
    if must_include is None:
        must_include = []
    try:
        soup = BeautifulSoup(html, features="lxml")
        occurrences = find_results(soup, must_include)
        return 1, occurrences

    except Exception as err:
        print str(err)
        print 'Failed to get occurrences'
        return 1, []


def parse_reverse_image_result(html):
    try:
        soup = BeautifulSoup(html, "html.parser")
        top_spans = find_top_result(soup)
        previews = find_results(soup)
        prediction = find_image_prediction(soup)
        return prediction, top_spans, previews

    except Exception as err:
        print str(err)
        print 'Reverse image search parse error'
        return "", [], []


def find_results(soup, must_include=None):
    previews = soup.findAll("span", {"class": "st"})
    if must_include is None:
        must_include = []
    if len(must_include) > 0:
        occurrences = []
        for preview in previews:
            current_text = preview.text
            last_splits = current_text.split("...")
            last_splits = filter(lambda x: len(x) >= 15, last_splits)
            for split in last_splits:
                if any(normalized(t) in split.lower() for t in must_include):
                    occurrences.append(re.sub(ur"[^\w']+", " ", split, flags=re.UNICODE))
        return occurrences
    else:
        return map(lambda x: x.text, previews)


def find_top_result(soup):
    top_spans = []
    top = soup.find("div", {"class", "xpdopen"})
    if top is not None:
        top_spans = top.findAll("span")
    top_spans = map(lambda x: decode(x.text), top_spans)
    return top_spans


def find_image_prediction(soup):
    prediction = ""
    prediction_card = soup.find("div", {"class", "card-section"})
    if prediction_card is not None:
        try:
            our_child = prediction_card.select("div")[-1]
            prediction = our_child.select_one("a").text
        except Exception as err:
            print str(err)
            print 'parsing top result failed'
    return decode(prediction)


def normalized(word):
    word = word.lower()
    word = word.replace(".", " ")
    word = word.replace(",", " ")
    return " " + word
