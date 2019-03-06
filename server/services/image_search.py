import os
import sys

from unidecode import unidecode


def do_search_images(keywords):
    joined_keywords = ','.join(map(lambda x: unidecode(x), keywords))
    try:
        script_path = get_script_path()
        command = "python " + script_path + " -k '" + joined_keywords + "' "
        bash_text = os.popen(command).read()
        urls = get_urls(bash_text)
        return urls
    except:
        print 'Image search failed'
        return []


def get_urls(bash_text):
    urls = []
    try:
        keyword_splits = bash_text.split("Errors: 0")
        for i, keyword_split in enumerate(keyword_splits):
            line_splits = keyword_split.split("\n")
            for line_split in line_splits:
                if 'Image URL:' in line_split:
                    url = line_split.split(": ")[-1]
                    urls.append({'keyword-index': i, 'url': url})
    except:
        print 'Failed to parse image search response: ', bash_text
    return urls


def get_script_path():
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    script_path = root_path + '/server/services/scripts/image_search.py'
    return script_path
