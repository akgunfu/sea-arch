import os
import sys
from PIL import Image
import pytesseract
import unicodedata


def get_ocr_result():
    cropped = get_image()
    text = pytesseract.image_to_string(cropped, lang="tur", config='--psm 6')

    # if type(text) is unicode:
    #    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore')

    try:
        return detect_question(text, '?')
    except ValueError as err:
        try:
            return detect_question(text, '\n\n')
        except ValueError as err_second_try:
            raise err_second_try


def get_image():
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    image_path = root_path + '/src/assets/screenshots/screen.png'
    image = Image.open(image_path)
    width, height = image.size
    cropped = image.crop((0, 380, width, height))
    return cropped


def detect_question(text, regex):
    tokens = []
    for token in text.split(regex):
        if len(token) > 0:
            tokens.append(token)

    print(tokens)

    if len(tokens) >= 2:
        question = tokens[0]
        choices = tokens[1]

        choice_tokens = []
        for choice in choices.split('\n'):
            if len(choice) > 0:
                choice_tokens.append(choice)

        print(choice_tokens)

        if len(choice_tokens) >= 3:
            choice1 = choice_tokens[0]
            choice2 = choice_tokens[1]
            choice3 = choice_tokens[2]

            return {'question': question, 'choices': {'a': choice1, 'b': choice2, 'c': choice3}}

        else:
            raise ValueError('Bad text detection. (Cannot separate choices)')

    else:
        raise ValueError('Bad text detection. (Cannot separate question and choices)')
