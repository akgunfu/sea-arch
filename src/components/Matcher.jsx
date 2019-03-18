import React from "react";
import Highlighter from "react-highlight-words";
import { CHARACTERS, normalize, split } from "./utils";

const markMatched = (word, keywords, className) => {
  if (typeof word !== "string") {
    return word;
  }

  if (
    keywords.some(keyword_ => normalize(word).includes(normalize(keyword_)))
  ) {
    return (
      <Highlighter
        highlightClassName={className}
        searchWords={[...keywords]}
        textToHighlight={word + CHARACTERS.WHITESPACE}
      />
    );
  }
  return word;
};

function Matcher(props) {
  const {
    baseKeywords = [],
    questionKeywords = [],
    nlpKeywords = [],
    occurrences = [],
    keywordA,
    keywordB,
    keywordC,
    classA,
    classB,
    classC
  } = props;

  return (
    <div className="match-container">
      {occurrences.map((text, i) => {
        const words = split(text);
        return (
          <p className="entry" key={i}>
            {words.map(word => {
              let _word = word + CHARACTERS.WHITESPACE;
              _word = markMatched(_word, split(keywordA, 0), classA);
              _word = markMatched(_word, split(keywordB, 0), classB);
              _word = markMatched(_word, split(keywordC, 0), classC);
              _word = markMatched(_word, questionKeywords, "q-k-match");
              _word = markMatched(_word, nlpKeywords, "q-k-match");
              _word = markMatched(_word, baseKeywords, "q-k-match");
              return _word;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default Matcher;
