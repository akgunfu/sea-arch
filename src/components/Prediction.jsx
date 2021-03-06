import React from "react";
import { Card, Col, Row } from "antd";
import {
  CHARACTERS,
  getFinalCalculation,
  getTextPrediction,
  split
} from "./utils";

function Prediction(props) {
  const { results = {}, detection = {} } = props;
  const {
    choices = {},
    nlp = CHARACTERS.EMPTY,
    question = CHARACTERS.EMPTY
  } = detection;

  const info = {};
  Object.keys(results).forEach(key => {
    const _result = results[key] || {};
    const used = _result.used || CHARACTERS.EMPTY;
    const texts = _result.text || [];

    const getChoiceKeywords = (choice = CHARACTERS.EMPTY) => {
      choice = choice.replace(CHARACTERS.HYPHEN, CHARACTERS.HYPHEN);
      choice = choice.replace(CHARACTERS.COMMA, CHARACTERS.WHITESPACE);
      return [
        ...split(choice, 0),
        ...split(nlp),
        ...split(used),
        ...split(question)
      ];
    };

    const keywordsA = getChoiceKeywords(choices.a);
    const keywordsB = getChoiceKeywords(choices.b);
    const keywordsC = getChoiceKeywords(choices.c);

    const textInfo = [];
    texts.forEach(text =>
      getTextPrediction(text, textInfo, keywordsA, keywordsB, keywordsC)
    );

    info[key] = {
      textInfo,
      result:
        (100.0 * (1.0 * (results[key] || {}).count)) /
        Object.values(results)
          .map(x => x.count || 0)
          .reduce((a = 0, b = 0) => a + b, 1)
    };
  });

  const calc = getFinalCalculation(info, results);

  console.log(info);
  console.log(calc);

  const total = Object.values(calc)
    .map(c => c.mixed)
    .reduce((a, b) => a + b, 1);

  return (
    <Row gutter={10}>
      <Col span={6}>
        <h3 className="centered-vertical">Prediction: </h3>
      </Col>
      {Object.keys(calc).map(key => (
        <Col span={6} key={key}>
          <Row className="stats">
            <Col span={2}>
              <b>{key.toLocaleUpperCase()}</b>
            </Col>
            <Col span={17} offset={1}>
              <Col
                className="stat"
                span={Math.floor(24 * (calc[key].mixed / total).toFixed(1))}
              >
                <br />
              </Col>
            </Col>
            <Col span={4}>{((100 * calc[key].mixed) / total).toFixed(1)}</Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}

export default Prediction;
