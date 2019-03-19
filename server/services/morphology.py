# -*- coding: utf-8 -*-

import os
import sys

SCRIPT_PATH = '/server/services/scripts/zemberek.py'

DEFAULT_ENCODING = "utf-8"

# These are self added by me on the script to identify blocks easily
SHELL_SPLIT = "###---###"
ROW_SPLIT = "<<!!>>"

FIRST_BLOCK = ['Ques', 'Punc', 'Conj', 'Det', 'Postp', 'PCNom', 'Conj', 'PCGen', 'Pron', 'Demons', 'PCDat']
SECOND_BLOCK = ['Adv', 'Verb']
THIRD_BLOCK = ['Adj', 'Unk']

WHITESPACE = " "

SYMBOLS = ["+", "-", ",", ".", "!", "?", "'", "*", "/", "&", "%", '#', '>', '<', "(", ")", "[", "]", "_", " "]
VOWELS = [u"a", u"e", u"i", u"ı", u"o", u"ö", u"u", u"ü"]
TURKISH_CHARS = [u"ç", u"Ç", u"ı", u"İ", u"ğ", u"Ğ", u"ö", u"Ö", u"ü", u"Ü", u"ş", u"Ş"]


def get_morphological_analysis(question):
    command = get_shell_command(question)
    try:
        result = os.popen(command.encode(DEFAULT_ENCODING)).read()
        shell_result = result.split(SHELL_SPLIT)[1]
        analysis_result = shell_result.split(ROW_SPLIT)

        info = get_sentence_info(question)

        words = get_words(analysis_result)
        words = filter_words(words, FIRST_BLOCK, True)
        words = filter_words(words, SECOND_BLOCK, False)
        words = filter_words(words, THIRD_BLOCK, False, 8)

        return WHITESPACE.join(map(lambda x: x['stem'], words)), info
    except Exception as e:
        print str(e)
        raise ValueError("An error occurred while analyzing the sentence")


def get_sentence_info(sentence):
    try:
        raw_words = sentence.split(" ")
        word_count = len(raw_words)
        letter_count = 0
        vowel_count = 0
        consonant_count = 0
        symbol_count = 0
        turkish_char_count = 0
        for word in raw_words:
            if word in SYMBOLS:
                symbol_count = symbol_count + 1
            else:
                for letter in word:
                    if letter in SYMBOLS:
                        symbol_count = symbol_count + 1
                    else:
                        if letter in VOWELS:
                            vowel_count = vowel_count + 1
                        else:
                            consonant_count = consonant_count + 1

                        if letter in TURKISH_CHARS:
                            turkish_char_count = turkish_char_count + 1

                        letter_count = letter_count + 1

        return {'word': word_count, 'letter': letter_count, 'vowels': vowel_count, 'consonants': consonant_count, 'symbols': symbol_count, 'turkish': turkish_char_count}
    except:
        print "Failed to analyze sentence"
        return {'word': 0, 'letter': 0, 'vowels': 0, 'consonants': 0, 'symbols': 0, 'turkish': 0}



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
def filter_words(words, blocked, override, max_size=7):
    _words = []
    if len(words) >= max_size or override:
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
