import React from "react";
import Highlighter from "react-highlight-words";

const markMatched = (word, keywords, className) => {
  if (typeof word !== "string") {
    return word;
  }

  if (
    keywords.some(keyword_ =>
      word.toLocaleLowerCase().includes(keyword_.toLocaleLowerCase())
    )
  ) {
    return (
      <Highlighter
        highlightClassName={className}
        searchWords={[...keywords]}
        textToHighlight={word + " "}
      />
    );
  }
  return word;
};

function Matcher(props) {
  const {
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
        const words = text.split(" ");
        return (
          <p className="entry" key={i}>
            {words.map(word => {
              let _word = word + " ";
              _word = markMatched(_word, keywordA.split(" "), classA);
              _word = markMatched(_word, keywordB.split(" "), classB);
              _word = markMatched(_word, keywordC.split(" "), classC);
              _word = markMatched(
                _word,
                questionKeywords,
                "question-keyword-match"
              );
              _word = markMatched(_word, nlpKeywords, "question-keyword-match");

              return _word;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default Matcher;
