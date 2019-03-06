import os
import sys

SHELL_SPLIT = "###---###"
ROW_SPLIT = "<<!!>>"


def get_morphological_analysis(question):
    command = get_shell_command(question)
    try:
        result = os.popen(command.encode("utf-8")).read()
        shell_result = result.split(SHELL_SPLIT)[1]
        analysis_result = shell_result.split(ROW_SPLIT)

        words = []
        first_list = get_first_result(analysis_result)
        words = process_first_list(first_list, words)

        finalized = " ".join(words)
        return finalized

    except Exception as e:
        print str(e)
        raise ValueError("An error occurred while analysing the sentence")


def get_shell_command(question):
    current_path = sys.path[0]
    root_path = os.path.abspath(os.path.join(current_path, os.pardir))
    zemberek_path = root_path + '/server/services/scripts/zemberek.py'
    question = question.replace("'", "")
    command = "python " + zemberek_path + " -s '" + question + "'"
    return command


def get_word_analysis(word_analysis):
    identifier = word_analysis.split(" ")[0]
    bracket_inner = identifier[identifier.find("[") + 1:identifier.find("]")]
    splits = bracket_inner.split(":")
    root = splits[0]
    types = splits[1].split(",")
    return root, types


# Gets preliminary results, if token size is bigger than excepted process again
def get_first_result(analysis_result):
    first_list = []
    for word_result in analysis_result:
        word_result = word_result.strip()
        lines = word_result.split("\n")
        word_analysis = lines[0]
        word_stems = lines[1]

        root, types = get_word_analysis(word_analysis)
        used_stem = word_stems.split(" ")[-1]

        any_blocked = get_if_blocked(types)

        if not any_blocked:
            print used_stem, types
            first_list.append({'stem': used_stem, 'types': types})
    return first_list


# Checks if given words types are blocked
def get_if_blocked(types):
    # Blocked types, might add more when found unnecessary
    blocked = ['Ques', 'Punc', 'Unk', 'Conj', 'Det', 'Adv', 'Verb', 'Postp', 'PCNom', 'Conj', 'PCGen', 'Pron', 'Demons',
               'PCDat']
    any_blocked = False
    for word_result in blocked:
        if word_result in types:
            any_blocked = True
    return any_blocked


# In second processing, due to size of query, adjectives are also eliminated
def process_first_list(first_list, words):
    # magic, typically good number
    if len(first_list) > 7:
        for entry in first_list:
            second_blocked = ['Adj']
            blocked = False
            for block in second_blocked:
                if block in entry['types']:
                    blocked = True
            if not blocked:
                words.append(entry['stem'])
    else:
        for entry in first_list:
            words.append(entry['stem'])
    return words
