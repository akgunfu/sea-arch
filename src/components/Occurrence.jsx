import React from "react";
import { Col, Row, Spin } from "antd";
import Matcher from "./Matcher";

function Occurrence(props) {
  const {
    results,
    imageResults,
    detection,
    fetching = false,
    fetchingImages = false
  } = props;

  const { choices = {}, nlp = "", question = "" } = detection;

  return (
    <Spin spinning={fetching}>
      <Row>
        {["a", "b", "c"].map((choice, i) => {
          const containerClass = "occurrences-" + choice;
          const titleClass = "search-title " + choice;

          const selfSearchResult = results[choice] || {};

          const selfOccurrences = selfSearchResult.text || [];
          const selfUsedForm = selfSearchResult.used || "";

          const baseKeywords = [
            ...question.split(" ").filter(token => token.length > 1)
          ];
          const questionKeywords = [
            ...selfUsedForm.split(" ").filter(token => token.length > 1)
          ];
          const nlpKeywords = [
            ...nlp.split(" ").filter(token => token.length > 2)
          ];

          return (
            <Col span={8}>
              <div className={containerClass} key={i}>
                <Row>
                  <Col span={24}>
                    <h2 className={titleClass}>
                      {choices[choice] || choice.toLocaleUpperCase()} -{" "}
                      {selfOccurrences.length}
                    </h2>
                  </Col>
                </Row>
                <Row>
                  <Spin spinning={fetchingImages}>
                    {(imageResults.result || [])
                      .filter(img => img["keyword-index"] === i + 1)
                      .map(imRes => {
                        return (
                          <img
                            className="result-image"
                            src={imRes.url}
                            alt={i}
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
                      keywordA={choices.a || " "}
                      keywordB={choices.b || " "}
                      keywordC={choices.c || " "}
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
