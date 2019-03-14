import urllib2
from bs4 import BeautifulSoup
from unidecode import unidecode

header = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
          'Accept-Encoding': 'none',
          'Accept-Language': 'en-US,en;q=0.8',
          'Connection': 'keep-alive'}


def do_search_texts(query, keyword, keywords):
    try:
        url = build_url(query)
        url = url.encode("utf-8")
        print url
        request = urllib2.Request(url, headers=header)
        response = urllib2.urlopen(request)
        html = response.read()
        soup = BeautifulSoup(html, features="lxml")
        return get_result(soup, keyword, keywords)
    except Exception as err:
        print "An error occurred while fetching url: " + str(err)
        return 0, []


def build_url(query):
    return 'http://google.com/search?q=' + query


def get_result(soup, choice, choices):
    result_count = get_result_count(soup)
    occurrences = get_occurrences(choice, soup, choices)
    return result_count, occurrences


def get_result_count(soup):
    try:
        div = soup.find(id="resultStats")
        result_str = unidecode(div.text)
        tokens = result_str.split(' ')
        try:
            return int(tokens[1].replace('.', ''))
        except:
            return int(tokens[0].replace('.', ''))
    except:
        print 'Failed to get result counts'
        return 0


def get_occurrences(choice, soup, choices):
    try:
        previews = soup.findAll("span", {"class": "st"})
        occurrences = []
        for preview in previews:
            current_text = preview.text
            if normalized(choice) in current_text.lower():
                last_splits = current_text.split("...")
                last_splits = filter(lambda x: len(x) > 15, last_splits)
                all_values = list(choices.values())
                for split in last_splits:
                    if any(normalized(t) in split.lower() for t in all_values):
                        occurrences.append(split)
        return occurrences
    except:
        print 'Failed to get occurrences'
        return []


def normalized(word):
    word = word.lower()
    word = word.replace(".", " ")
    word = word.replace(",", " ")
    words = word.split(" ")
    return " ".join(words)
