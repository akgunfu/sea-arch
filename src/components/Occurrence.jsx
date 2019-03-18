import React from "react";
import { Col, Row, Spin } from "antd";
import Matcher from "./Matcher";
import { CHARACTERS, CHOICES, split } from "./utils";

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
      <Row>
        {[CHOICES.A, CHOICES.B, CHOICES.C].map((choice, i) => {
          const containerClass = "occurrences-" + choice;
          const titleClass = "search-title " + choice;

          const selfSearchResult = results[choice] || {};
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
