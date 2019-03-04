import urllib2
from bs4 import BeautifulSoup
from unidecode import unidecode

header = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
          'Accept-Encoding': 'none',
          'Accept-Language': 'en-US,en;q=0.8',
          'Connection': 'keep-alive'}


def do_search(query, keyword):
    try:
        url = build_url(query)
        url = url.encode("utf-8")
        print url
        request = urllib2.Request(url, headers=header)
        response = urllib2.urlopen(request)
        html = response.read()
        soup = BeautifulSoup(html, features="lxml")
        return get_result(soup, keyword)
    except Exception as err:
        print "An error occurred while fetching url: " + str(err)
        return 0, []


def build_url(query):
    return 'http://google.com/search?q=' + query


def get_result(soup, choice):
    result_count = get_result_count(soup)
    occurrences = get_occurrences(choice, soup)
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


def get_occurrences(choice, soup):
    try:
        previews = soup.findAll("span", {"class": "st"})
        occurrences = []
        for preview in previews:
            current_text = preview.text
            if choice in current_text:
                occurrences.append(current_text)
        return occurrences
    except:
        print 'Failed to get occurrences'
        return []
