import urllib2
from bs4 import BeautifulSoup

header = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
          'Accept-Encoding': 'none',
          'Accept-Language': 'en-US,en;q=0.8',
          'Connection': 'keep-alive'}


def build_url(query):
    return 'http://google.com/search?q=' + query


def search_counts(word):
    try:
        url = build_url(word)
        print url
        req = urllib2.Request(url, headers=header)
        response = urllib2.urlopen(req)
        html = response.read()
        soup = BeautifulSoup(html, features="lxml")
        div = soup.find(id="resultStats")
        return div.text
    except:
        print "An error occurred while fetching url"
        return 0
