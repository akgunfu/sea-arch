import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS, cross_origin

from services.text_search import do_search_texts, do_search_top
from services.image_search import do_search_images
from services.reverse_image_search import do_reverse_image_search
from services.query import build_query
from services.ocr import get_ocr_result
from services.common import get_current_time

app = Flask(__name__, static_folder='../build')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

DEVICES = [
    {'serial': 'HVY0218A09003965', 'start': 345},  # akgunfu's device
    {'serial': '41424156414e3098', 'start': 200},  # oozan's device
    {'serial': '9e599a8d', 'start': 365},  # fehim's device
    {'serial': '192.168.57.101:5555', 'start': 220}  # genymotion emulator
]

# CAPTURE SCREEN
@app.route('/api/screen-shot', methods=['GET'])
@cross_origin()
def screen_shot():
    devices_result = os.popen('adb devices').read()
    for device in DEVICES:
        serial = device.get('serial')
        if serial in devices_result:
            time = get_current_time()
            os.system("adb -s " + serial + " exec-out screencap -p > $(pwd)/src/assets/screenshots/screen-" + str(time) + ".png")
            return response_success({'start': device.get('start'), 'capture': "screen-" + str(time) + ".png"})
    else:
        print 'No screenshot for now'
        return response_error("Device is not connected")


# DETECT TEXT
@app.route('/api/ocr', methods=['POST'])
@cross_origin()
def extract_text():
    request_data = request.json
    start = request_data.get('start')
    capture = request_data.get('capture')
    use_nlp = request_data.get('nlp')
    try:
        text = get_ocr_result(use_nlp, capture, start)
        return response_success(text)
    except ValueError as err:
        print 'Cannot detect'
        return response_error(str(err))


# AUTO SEARCH WITH NLP
@app.route('/api/search', methods=['POST'])
@cross_origin()
def search():
    # get data from request
    request_data = request.json
    question = request_data.get('question')
    nlp = request_data.get('nlp')
    choice = request_data.get('choice')
    choices = request_data.get('choices')
    # do action
    search_query, used = build_query(question, choice, nlp)
    result, text, top = do_search_texts(search_query, choices)
    return response_success({'result': result, 'texts': text, 'used': used, 'top': top})


# REVERSE IMAGE SEARCH
@app.route('/api/reverse-image-search', methods=['POST'])
@cross_origin()
def reverse_image_search():
    request_data = request.json
    capture = request_data.get('capture')
    prediction, top, preview = do_reverse_image_search(capture)
    return response_success({'result': {'prediction': prediction, 'top': top, 'preview': preview}})


# KEYWORD SEARCH
@app.route('/api/query', methods=['POST'])
@cross_origin()
def query_search():
    request_data = request.json
    query = request_data.get('query')
    choice = request_data.get('choice')
    search_query, used = build_query(query, choice, query)
    br, eb, kp = do_search_top(search_query)
    return response_success({'best_result': br, 'extabar_result': eb, 'knowledge_panel': kp})


@app.route('/api/search-images', methods=['POST'])
@cross_origin()
def search_images():
    # get data from request
    request_data = request.json
    question = request_data.get('question')
    nlp = request_data.get('nlp')
    choices = request_data.get('choices')
    a = choices.get('a')
    b = choices.get('b')
    c = choices.get('c')
    # do action
    query_a, used = build_query(question, a, nlp)
    query_b, used = build_query(question, b, nlp)
    query_c, used = build_query(question, c, nlp)
    used = used.replace("'", ' ')
    used = used.replace(",", ' ')
    result = do_search_images([used, query_a, query_b, query_c])
    return response_success({'result': result})


def response_success(data={}):
    return jsonify({
        'successful': True,
        'data': data
    })


def response_error(error):
    return jsonify({
        'successful': False,
        'errorMessage': error
    })


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return send_from_directory(app.static_folder, 'index.html')
