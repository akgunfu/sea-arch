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

  const { choices = {}, nlp = "" } = detection;

  return (
    <Spin spinning={fetching}>
      {["a", "b", "c"].map((choice, i) => {
        const containerClass = "occurrences-" + choice;
        const titleClass = "search-title " + choice;

        const selfSearchResult = results[choice] || {};

        const selfOccurrences = selfSearchResult.text || [];
        const selfUsedForm = selfSearchResult.used || "";

        const questionKeywords = [
          ...selfUsedForm.split(" ").filter(token => token.length > 1)
        ];
        const nlpKeywords = [
          ...nlp.split(" ").filter(token => token.length > 2)
        ];

        return (
          <div className={containerClass} key={i}>
            <Row>
              <Col span={24}>
                <h2 className={titleClass}>
                  {choices[choice] || ""} - {selfOccurrences.length}
                </h2>
              </Col>
            </Row>
            <Row>
              <Col span={3}>
                <Spin spinning={fetchingImages}>
                  {(imageResults.result || [])
                    .filter(img => img["keyword-index"] === i + 1)
                    .map(imRes => {
                      return (
                        <img className="result-image" src={imRes.url} alt={i} />
                      );
                    })}
                </Spin>
              </Col>
              <Col span={21} offset={0}>
                <Matcher
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
        );
      })}
    </Spin>
  );
}

export default Occurrence;
