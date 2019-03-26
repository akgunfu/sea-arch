from PIL import Image
import pytesseract
import re

from morphology import get_morphological_analysis
from common import get_capture_path


def get_ocr_result(use_nlp, start=345):
    image = get_image(start)
    detected = pytesseract.image_to_string(image, lang="tur", config='--psm 6')
    try:
        return detect_question(detected, '?', use_nlp)
    except ValueError as err:
        print str(err)
        try:
            return detect_question(detected, '\n\n', use_nlp)
        except ValueError as err_second_try:
            raise err_second_try


def get_image(start):
    image_path = get_capture_path()
    image = Image.open(image_path)
    width, height = image.size
    cropped = image.crop((0, start, width, height))
    return cropped


def detect_question(text, regex, use_nlp):
    # Split all text by ? or double new line
    tokens = []
    for token in text.split(regex):
        if len(token) > 0:
            tokens.append(token)

    # If 2 or more are tokens, assume first as question and second as choices
    if len(tokens) >= 2:
        question = tokens[0]
        choices = tokens[1]

        question = re.sub(ur"[^\w']+", " ", question, flags=re.UNICODE)

        morph_result = ""
        info = {}
        spelling=[]
        if use_nlp:
            # Use nlp on question to reduce word count and to match more search results
            try:
                morph_result, info, spelling = get_morphological_analysis(question)
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
                'nlp': morph_result,
                'info': info,
                'spelling': spelling
            }

        else:
            raise ValueError('Bad text detection. (Cannot separate choices)')

    else:
        raise ValueError('Bad text detection. (Cannot separate question and choices)')
