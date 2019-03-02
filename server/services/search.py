import urllib2
from bs4 import BeautifulSoup
import unicodedata

header = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
          'Accept-Encoding': 'none',
          'Accept-Language': 'en-US,en;q=0.8',
          'Connection': 'keep-alive'}


def build_url(query, engine):
    if engine == 'google':
        return 'http://google.com/search?q=' + query
    if engine == 'yahoo':
        return 'http://search.yahoo.com/search;?p=' + query
    if engine == 'yandex':
        return 'http://yandex.com.tr/search/?text=' + query
    if engine == 'bing':
        return 'http://www.bing.com/search?q=' + query
    if engine == 'duck':
        return 'http://duckduckgo.com/?q=' + query

    raise ValueError('No configurations found for engine')


def search_counts(word, engine):
    try:
        url = build_url(word, engine)
        req = urllib2.Request(url, headers=header)
        response = urllib2.urlopen(req)
        html = response.read()
        soup = BeautifulSoup(html, features="lxml")
        return get_result(soup, engine)
    except:
        print "An error occurred while fetching url"
        return 0

def get_result(soup, engine):
    if engine == 'google':
        div = soup.find(id="resultStats")
        result_str = div.text
        result_str = unicodedata.normalize('NFKD', result_str).encode('ascii', 'ignore')
        tokens = result_str.split(' ')
        return int(tokens[1].replace('.', ''))

    if engine == 'yahoo':
        divs = soup.findAll("div", {"class": "compPagination"})
        spans = divs[0].findChildren("span", recursive=False)
        span = spans[0]
        result_str = span.text
        result_str = unicodedata.normalize('NFKD', result_str).encode('ascii', 'ignore')
        tokens = result_str.split(' ')
        return int(tokens[0].replace(',', ''))

    if engine == 'yandex':
        div = soup.findAll("div", {"class": "serp-adv__found"})[0]
        result_str = div.text
        result_str = unicodedata.normalize('NFKD', result_str).encode('ascii', 'ignore')
        tokens = result_str.split(' ')
        num = int(tokens[0])
        text = tokens[1]
        # very good generic code huh
        if text == 'milyon':
            return num * 1000000
        if text == 'bin':
            return num * 1000
        return num
