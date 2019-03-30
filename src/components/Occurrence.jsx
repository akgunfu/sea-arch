import React from "react";
import { Col, Row, Spin } from "antd";
import Matcher from "./Matcher";
import { CHARACTERS, CHOICES, split } from "./utils";

// Temporary
const ucgenify = value => {
  let _value = value;
  try {
    _value = _value.replace("-", " ");
    _value = _value.replace("_", " ");
    _value = _value.replace(",", " ");

    const splits = _value.split(" ");
    if (splits.length === 3) {
      const a = parseInt(splits[0]);
      const b = parseInt(splits[1]);
      const c = parseInt(splits[2]);

      if (a * a + b * b === c * c) {
        return <p>Dik Üçgen !!!!!!</p>;
      } else if (a * a + c * c === b * b) {
        return <p>Dik Üçgen !!!!!!</p>;
      } else if (b * b + c * c === a * a) {
        return <p>Dik Üçgen !!!!!!</p>;
      }
    }
  } catch (e) {}
};

function Occurrence(props) {
  const {
    results,
    imageResults,
    detection,
    fetching = false,
    fetchingImages = false
  } = props;

  const {
    choices = {},
    nlp = CHARACTERS.EMPTY,
    question = CHARACTERS.EMPTY
  } = detection;

  return (
    <Spin spinning={fetching}>
      <Row gutter={5}>
        {[CHOICES.A, CHOICES.B, CHOICES.C].map((choice, i) => {
          const containerClass = "occurrences-" + choice;
          const titleClass = "search-title " + choice;

          const selfSearchResult = results[choice] || {};
          const selfBestResult = selfSearchResult.best || [];
          const selfExtaResult = selfSearchResult.exta || [];
          const selfKnowledgeResult = selfSearchResult.knowledge || [];
          const selfOccurrences = selfSearchResult.text || [];
          const selfUsedForm = selfSearchResult.used || CHARACTERS.EMPTY;

          const baseKeywords = split(question);
          const questionKeywords = split(selfUsedForm);
          const nlpKeywords = split(nlp);

          return (
            <Col span={8} key={i}>
              <div className={containerClass}>
                <Row>
                  <Col span={24}>
                    <h2 className={titleClass}>
                      {choices[choice] || choice.toLocaleUpperCase()} -
                      {CHARACTERS.WHITESPACE}
                      {selfOccurrences.length}
                    </h2>
                  </Col>
                </Row>
                <Row>
                  {ucgenify(choices[choice])}
                  <Spin spinning={fetchingImages}>
                    {(imageResults.result || [])
                      .filter(img => img["keyword-index"] === i + 1)
                      .map((imRes, j) => {
                        return (
                          <img
                            className="result-image"
                            src={imRes.url}
                            alt={i}
                            key={j}
                          />
                        );
                      })}
                  </Spin>
                </Row>
                <Row>
                  {selfBestResult.length > 0 && (
                    <div className="best-result">
                      {selfBestResult.map(a => (
                        <h2>{a}</h2>
                      ))}
                    </div>
                  )}
                  {selfKnowledgeResult.length > 0 && (
                    <div className="knowledge-result">
                      {selfKnowledgeResult.map(a => (
                        <p>{a}</p>
                      ))}
                    </div>
                  )}
                  {selfExtaResult.length > 0 && (
                    <div className="exta-result">
                      {selfExtaResult.map(a => (
                        <p>{a}</p>
                      ))}
                    </div>
                  )}
                </Row>
                <Row>
                  <Col span={24}>
                    <Matcher
                      baseKeywords={baseKeywords}
                      questionKeywords={questionKeywords}
                      nlpKeywords={nlpKeywords}
                      occurrences={selfOccurrences}
                      current={choice}
                      keywordA={choices.a || CHARACTERS.WHITESPACE}
                      keywordB={choices.b || CHARACTERS.WHITESPACE}
                      keywordC={choices.c || CHARACTERS.WHITESPACE}
                      classA="answer-keyword-match-a"
                      classB="answer-keyword-match-b"
                      classC="answer-keyword-match-c"
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
}

export default Occurrence;
