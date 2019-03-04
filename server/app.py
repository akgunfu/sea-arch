import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS, cross_origin

from services.search import search_combination_counts
from services.query import build_query
from services.ocr import get_ocr_result

app = Flask(__name__, static_folder='../build')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/search-combination', methods=['POST'])
@cross_origin()
def search_combination():
    request_data = request.json
    question = request_data.get('question')
    choice = request_data.get('choice')
    engine = request_data.get('engine')
    nlp = request_data.get('nlp')
    result = 0
    try:
        result = search_combination_counts(build_query([choice, question], nlp), engine)
    except Exception as err:
        print "######"  + str(err)
    return response_success({'result': result})


@app.route('/api/screen-shot', methods=['GET'])
@cross_origin()
def screen_shot():
    devices_result = os.popen('adb devices').read()
    # my device
    if 'HVY0218A09003965' in devices_result:
        os.system("adb exec-out screencap -p > $(pwd)/src/assets/screenshots/screen.png")
        return response_success()
    else:
        print 'No screenshot for now'
        return response_error("Device is not connected")


@app.route('/api/ocr', methods=['GET'])
@cross_origin()
def extract_text():
    try:
        text = get_ocr_result()
        return response_success(text)
    except ValueError as err:
        print 'Cannot detect'
        return response_error(str(err))


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
