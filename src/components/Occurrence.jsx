import React from "react";
import { Col, Row, Spin } from "antd";
import Matcher from "./Matcher";

function Occurrence(props) {
  const { results, imageResults, detection, fetching = false } = props;

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
              <Col span={1}>
                {(imageResults.result || [])
                  .filter(img => img["keyword-index"] === i + 1)
                  .map(imRes => {
                    return <img src={imRes.url} alt={i} width={100} height={100}/>;
                  })}
              </Col>
              <Col span={22} offset={1}>
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
