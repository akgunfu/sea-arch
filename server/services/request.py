import urllib2
import requests

from common import get_capture_path

HEADERS = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
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


def image_upload():
    file_path = get_capture_path()
    multipart = {'encoded_image': (file_path, open(file_path, 'rb')), 'image_content': ''}
    response = requests.post(IMAGE_UPLOAD_URL, files=multipart, allow_redirects=False)
    url = response.headers['Location']
    response = requests.get(url, headers=HEADERS_SIMPLE)
    return response.content
