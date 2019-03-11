import os
import sys

SCRIPT_PATH = '/server/services/scripts/zemberek.py'

DEFAULT_ENCODING = "utf-8"

# These are self added by me on the script to identify blocks easily
SHELL_SPLIT = "###---###"
ROW_SPLIT = "<<!!>>"

FIRST_BLOCK = ['Ques', 'Punc', 'Unk', 'Conj', 'Det', 'Postp', 'PCNom', 'Conj', 'PCGen', 'Pron', 'Demons', 'PCDat']
SECOND_BLOCK = ['Adv', 'Verb']
THIRD_BLOCK = ['Adj']

WHITESPACE = " "


def get_morphological_analysis(question):
    command = get_shell_command(question)
    try:
        result = os.popen(command.encode(DEFAULT_ENCODING)).read()
        shell_result = result.split(SHELL_SPLIT)[1]
        analysis_result = shell_result.split(ROW_SPLIT)

        words = get_words(analysis_result)
        words = filter_words(words, FIRST_BLOCK)
        words = filter_words(words, SECOND_BLOCK)
        words = filter_words(words, THIRD_BLOCK, 8)

        return WHITESPACE.join(map(lambda x: x['stem'], words))
    except Exception as e:
        print str(e)
        raise ValueError("An error occurred while analyzing the sentence")


def get_shell_command(question):
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    zemberek_path = root_path + SCRIPT_PATH
    question = question.replace("'", "")
    return "python " + zemberek_path + " -s '" + question + "'"


# Gets tokenized words from nlp result
def get_words(analysis_result):
    first_list = []
    for word_result in analysis_result:
        word_result = word_result.strip()
        lines = word_result.split("\n")
        word_analysis = lines[0]
        word_stems = lines[1]
        root, types = get_word_analysis(word_analysis)
        used_stem = word_stems.split(WHITESPACE)[-1]

        # Show all word types, for debugging purposes
        print root, types, word_stems

        first_list.append({'stem': used_stem, 'types': types})
    return first_list


def get_word_analysis(word_analysis):
    # example => "[elma:Noun,Prop] elmalar:Noun+ .. vs
    identifier = word_analysis.split(WHITESPACE)[0]
    bracket_inner = identifier[identifier.find("[") + 1:identifier.find("]")]
    splits = bracket_inner.split(":")
    root = splits[0]
    types = splits[1].split(",")
    return root, types


# Filters tokens depending on blocked list and max size constraint
def filter_words(words, blocked, max_size=7):
    _words = []
    if len(words) > max_size:
        for word in words:
            is_blocked = get_if_blocked(word['types'], blocked)
            if not is_blocked:
                _words.append({'stem': word['stem'], 'types': word['types']})
        return _words
    return words


# Checks if given word types are blocked
def get_if_blocked(types, blocked):
    any_blocked = False
    for _type in types:
        if _type in blocked:
            any_blocked = True
    return any_blocked
