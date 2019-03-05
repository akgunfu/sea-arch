import React from "react";
import Highlighter from "react-highlight-words";

function Matcher(props) {
  const {
    questionKeywords = [],
    nlpKeywords = [],
    keyword,
    type,
    texts = [],
    keyword2,
    type2,
    keyword3,
    type3
  } = props;

  return (
    <div className="match-container">
      {texts.map(text => {
        const words = text.split(" ");
        return (
          <p className="entry">
            {words.map(word => {
              if (
                word.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
              ) {
                return (
                  <Highlighter
                    highlightClassName={type}
                    searchWords={[keyword]}
                    textToHighlight={word + " "}
                  />
                );
              }
              if (
                word.toLocaleLowerCase().includes(keyword2.toLocaleLowerCase())
              ) {
                return (
                  <Highlighter
                    highlightClassName={type2}
                    searchWords={[keyword2]}
                    textToHighlight={word + " "}
                  />
                );
              }
              if (
                word.toLocaleLowerCase().includes(keyword3.toLocaleLowerCase())
              ) {
                return (
                  <Highlighter
                    highlightClassName={type3}
                    searchWords={[keyword2]}
                    textToHighlight={word + " "}
                  />
                );
              }
              if (
                questionKeywords.some(keyword_ =>
                  word.toLocaleLowerCase().includes(keyword_.toLocaleLowerCase())
                )
              ) {
                return (
                  <Highlighter
                    highlightClassName="question-keyword-match"
                    searchWords={[...questionKeywords]}
                    textToHighlight={word + " "}
                  />
                );
              }
              if (
                nlpKeywords.some(keyword_ =>
                  word.toLocaleLowerCase().includes(keyword_.toLocaleLowerCase())
                )
              ) {
                return (
                  <Highlighter
                    highlightClassName="question-keyword-match"
                    searchWords={[...nlpKeywords]}
                    textToHighlight={word + " "}
                  />
                );
              }
              return word + " ";
            })}
          </p>
        );
      })}
    </div>
  );
}

export default Matcher;
