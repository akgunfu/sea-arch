import os
import sys
import requests
from bs4 import BeautifulSoup
from unidecode import unidecode

SCREEN_CAPTURE_PATH = '/src/assets/screenshots/screen.png'


def get_image_path():
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    return root_path + SCREEN_CAPTURE_PATH

def do_reverse_image_search():
    try:
        filePath = get_image_path()
        searchUrl = 'http://www.google.com/searchbyimage/upload'
        multipart = {'encoded_image': (filePath, open(filePath, 'rb')), 'image_content': ''}
        response = requests.post(searchUrl, files=multipart, allow_redirects=False)
        url = response.headers['Location']
        response = requests.get(url, headers={"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"})
        html = response.content
        soup = BeautifulSoup(html, "html.parser")
        return get_result(soup)
    except:
        print 'Reverse image search connection error'
        return "Failed to find", [], []


def get_result(soup):
    top_spans = []
    previews = []
    prediction = ""
    try:
    	top = soup.find("div", {"class", "xpdopen"})
    	if not top is None:
    		top_spans = top.findAll("span")
    	previews = soup.findAll("span", {"class": "st"})
    	prediction_card = soup.find("div", {"class", "card-section"})
    	if not prediction_card is None:
    	    try:
                our_child = prediction_card.select("div")[-1]
                prediction = our_child.select_one("a").text
            except:
                print 'top failed'
    	top_spans = map(lambda x: unidecode(x.text), top_spans)
    	previews = map(lambda x: unidecode(x.text), previews)
    except Exception as err:
    	print str(err)
    	print 'Reverse image search parse error'

    return unidecode(prediction), top_spans, previews


