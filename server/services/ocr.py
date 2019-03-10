import os
import sys
from PIL import Image
import pytesseract

from morphology import get_morphological_analysis

SCREEN_CAPTURE_PATH = '/src/assets/screenshots/screen.png'


def get_ocr_result():
    cropped = get_image()
    text = pytesseract.image_to_string(cropped, lang="tur", config='--psm 6')
    try:
        return detect_question(text, '?')
    except ValueError as err:
        try:
            return detect_question(text, '\n\n')
        except ValueError as err_second_try:
            raise err_second_try


def get_image(start=345):
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    image_path = root_path + SCREEN_CAPTURE_PATH
    image = Image.open(image_path)
    width, height = image.size
    gray = image.convert('L')
    cropped = gray.crop((85, start, width-85, 5*height/7))
    cropped = cropped.point(lambda x: 0 if x<210 else 255, '1')
    return cropped


def detect_question(text, regex):
    # Split all text by ? or double new line
    tokens = []
    for token in text.split(regex):
        if len(token) > 0:
            tokens.append(token)

    # If 2 or more are tokens, assume first as question and second as choices
    if len(tokens) >= 2:
        question = tokens[0]
        choices = tokens[1]

        # Use nlp on question to reduce word count and to match more search results
        try:
            morph_result = get_morphological_analysis(question)
        except:
            morph_result = question

        # Assume choices
        choice_tokens = []
        for choice in choices.split('\n'):
            if len(choice) > 0:
                choice_tokens.append(choice)

        if len(choice_tokens) >= 3:
            choice1 = choice_tokens[0]
            choice2 = choice_tokens[1]
            choice3 = choice_tokens[2]

            return {
                'question': question,
                'choices':
                    {'a': choice1,
                     'b': choice2,
                     'c': choice3},
                'nlp': morph_result
            }

        else:
            raise ValueError('Bad text detection. (Cannot separate choices)')

    else:
        raise ValueError('Bad text detection. (Cannot separate question and choices)')
