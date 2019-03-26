import requests
import urllib2
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

import time
current_milli_time = lambda: int(round(time.time() * 1000))

from common import get_capture_path, get_chrome_driver_path

HEADERS = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) ',
           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
           'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
           'Accept-Encoding': 'none',
           'Accept-Language': 'en-US,en;q=0.8',
           'Connection': 'keep-alive'}

HEADERS_SIMPLE = {
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 "
                  "Safari/537.36"}

IMAGE_UPLOAD_URL = 'http://www.google.com/searchbyimage/upload'


def do_request(url):
    request = urllib2.Request(url, headers=HEADERS)
    response = urllib2.urlopen(request)
    return response.read()

def do_request_simple(url):
    options = Options()
    options.headless = True
    options.lang='en'
    browser = webdriver.Chrome(get_chrome_driver_path(), chrome_options=options)
    browser.get(url)

    browser.get_screenshot_as_file('selenium-capture/' + str(current_milli_time()) + '.png')

    # Parse results
    br = []
    try:
        best_result = browser.find_element_by_xpath("//div[@id='ires'][1]/div[@id='rso']/div/div/div/div/div/div[2]/div[2]")
        if best_result is not None:
            splits = best_result.text.split("\n")
            print splits
            for split in splits:
                br.append(split)
    except:
        print "No best result found"


    eb = []
    try:
        # extabar RL = //div[@id='extabar']/div/div/div/div/div/div[2]
        # extabar CR = //div[@id='extabar']/div[2]/div/div/g-scrolling-carousel/div

        try:
            extabar = browser.find_element_by_xpath("//div[@id='extabar']/div/div/div/div/div/div[2]")
        except:
            extabar = browser.find_element_by_xpath("//div[@id='extabar']/div[2]/div/div/g-scrolling-carousel/div")

        if extabar is not None:
            splits = extabar.text.split("\n")
            print splits
            for split in splits:
                eb.append(split)
    except:
        print "No extabar found"


    kp = []
    try:
        knowledge_panel = browser.find_element_by_xpath("//div[@id='rhs_block'][1]/div")
        if knowledge_panel is not None:
            splits = knowledge_panel.text.split("\n")
            print splits
            for split in splits:
                kp.append(split)
    except:
        print "No knowledge panel found"

    return br, eb, kp


def image_upload():
    file_path = get_capture_path()
    multipart = {'encoded_image': (file_path, open(file_path, 'rb')), 'image_content': ''}
    response = requests.post(IMAGE_UPLOAD_URL, files=multipart, allow_redirects=False)
    url = response.headers['Location']
    response = requests.get(url, headers=HEADERS_SIMPLE)
    return response.content
