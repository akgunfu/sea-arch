# -*- coding: utf-8 -*-

import jpype as jp
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-s", "--sentence", dest="sentence", type=lambda s: unicode(s, 'utf8'),
                    help="sentence to process", metavar="SENTENCE")

args = parser.parse_args()

# Relative path to Zemberek .jar
ZEMBEREK_PATH = './server/services/nlp/bin/zemberek-full.jar'

# Start the JVM
jp.startJVM(jp.getDefaultJVMPath(), '-ea', '-Djava.class.path=%s' % (ZEMBEREK_PATH))

# Import required Java classes
TurkishMorphology = jp.JClass('zemberek.morphology.TurkishMorphology')
Paths = jp.JClass('java.nio.file.Paths')

# Instantiating the morphology class with the default RootLexicon
morphology = TurkishMorphology.createWithDefaults()

# Dummy sentence to work on
sentence = args.sentence

# Analyzing the dummy sentence. The returning WordAnalysis
# object which can include zero or more SingleAnalysis objects
analysis = morphology.analyzeSentence(sentence)

# Resolving the ambiguity
results = morphology.disambiguate(sentence, analysis).bestAnalysis()

print '###---###'

result_list = enumerate(results)
# Printing the results
for i, result in result_list:
    print(result.formatLong())
    print(' '.join(result.getStems()))
    if i != len(results) - 1:
        print '<<!!>>'

print '###---###'

# Shutting down the JVM
jp.shutdownJVM()
