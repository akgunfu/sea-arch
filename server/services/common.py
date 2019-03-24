import os
import sys
from unidecode import unidecode

DEFAULT_ENCODING = "utf-8"
SCREEN_CAPTURE_PATH = '/src/assets/screenshots/screen.png'
PHANTOMJS_PATH = '/server/services/lib/phantomjs/bin/phantomjs'
TEXT_SEARCH_URL = 'http://google.com/search?q='


def decode(word):
    if type(word) is unicode:
        return unidecode(word)
    return word


def get_capture_path():
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    return root_path + SCREEN_CAPTURE_PATH

def get_phantomjs_path():
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    return root_path + PHANTOMJS_PATH
