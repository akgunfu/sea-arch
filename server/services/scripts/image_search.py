from google_images_download import google_images_download

from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-k", "--keywords", dest="keywords", type=lambda s: unicode(s, 'utf8'),
                    help="keywords to process", metavar="KEYWORDS")
parser.add_argument("-c", "--count", dest="count",
                    help="image count", metavar="COUNT")

args = parser.parse_args()

limit = 2
if args.count:
    limit = args.count

response = google_images_download.googleimagesdownload()
arguments = {"keywords": args.keywords, "limit": limit, "no_download": True}
response.download(arguments)
