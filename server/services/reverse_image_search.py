from request import image_upload
from soup_parser import parse_reverse_image_result


def do_reverse_image_search(capture):
    try:
        html = image_upload(capture)
        return parse_reverse_image_result(html)
    except Exception as err:
        print str(err)
        print 'Reverse image search connection error'
        return "Failed to find", [], []
