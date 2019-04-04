import os
import sys
from unidecode import unidecode

import time
get_current_time = lambda: int(round(time.time() * 1000))

DEFAULT_ENCODING = "utf-8"
SCREEN_CAPTURE_PATH = '/src/assets/screenshots/'
CHROME_DRIVER_PATH = '/server/services/lib/chromedriver/chromedriver'
TEXT_SEARCH_URL = 'http://google.com/search?q='


def decode(word):
    if type(word) is unicode:
        return unidecode(word)
    return word


def get_capture_path(capture):
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    return root_path + SCREEN_CAPTURE_PATH + capture

def get_chrome_driver_path():
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    return root_path + CHROME_DRIVER_PATH
