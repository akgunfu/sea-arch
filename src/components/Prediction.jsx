import React from "react";
import { Card, Col, Row } from "antd";

const findMean = (indices = []) => {
  if (indices.length === 0) {
    return 0;
  }
  if (indices.length % 2 === 1) {
    return indices[Math.floor(indices.length / 2) + 1];
  }
  return (indices[indices.length / 2 - 1] + indices[indices.length / 2]) / 2;
};

const deviation = (indices = []) => {
  if (indices.length < 2) {
    return 0;
  }

  const mean = findMean(indices);
  const sqrt_sum = indices
    .map(x => (x - mean) * (x - mean))
    .reduce((a, b) => a + b, 0);
  return Math.sqrt(sqrt_sum / (indices.length - 1));
};

const longestMatch = (indices = []) => {
  if (indices.length < 1) {
    return 0;
  }

  let longest = 1;
  let match = 1;
  indices.forEach((index, i) => {
    if (indices.length >= i + 1) {
      if (index + 1 === indices[i + 1]) {
        match = match + 1;
        if (match > longest) {
          longest = match;
        }
      } else {
        match = 1;
      }
    }
  });

  return longest;
};

function Prediction(props) {
  const { results = {}, detection = {} } = props;
  const { choices = {}, nlp = "", question = "" } = detection;

  const info = {};
  Object.keys(results).forEach(key => {
    const _result = results[key] || {};
    const used = _result.used || "";
    const texts = _result.text || [];

    const getChoiceKeywords = (choice = "") => {
      choice = choice.replace("-", " ");
      choice = choice.replace(",", " ");
      return [
        ...choice.split(" "),
        ...nlp.split(" "),
        ...used.split(" "),
        ...question.split(" ")
      ].filter(a => a.length > 1);
    };

    const keywordsA = getChoiceKeywords(choices.a);
    const keywordsB = getChoiceKeywords(choices.b);
    const keywordsC = getChoiceKeywords(choices.c);

    const textInfo = [];
    texts.forEach(text => {
      let words = text.split(" ");
      const tokenSize = words.length;

      let highlightIndexA = [];
      words.forEach((word, i) => {
        keywordsA.forEach(keyword => {
          if (word.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
            highlightIndexA.push(i);
          }
        });
      });

      let highlightIndexB = [];
      words.forEach((word, i) => {
        keywordsB.forEach(keyword => {
          if (word.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
            highlightIndexB.push(i);
          }
        });
      });

      let highlightIndexC = [];
      words.forEach((word, i) => {
        keywordsC.forEach(keyword => {
          if (word.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
            highlightIndexC.push(i);
          }
        });
      });

      highlightIndexA = [...new Set(highlightIndexA)];
      highlightIndexB = [...new Set(highlightIndexB)];
      highlightIndexC = [...new Set(highlightIndexC)];

      const deviationA = deviation(highlightIndexA);
      const deviationB = deviation(highlightIndexB);
      const deviationC = deviation(highlightIndexC);
      const longestA = longestMatch(highlightIndexA);
      const longestB = longestMatch(highlightIndexB);
      const longestC = longestMatch(highlightIndexC);

      const matchA = highlightIndexA.length;
      const matchB = highlightIndexB.length;
      const matchC = highlightIndexC.length;

      const isCurrent = _key => {
        return _key === key;
      };

      const currentLongest =
        key === "a"
          ? longestA
          : key === "b"
          ? longestB
          : key === "c"
          ? longestC
          : 1;

      const penalty = _key => {
        if (isCurrent(_key)) {
          return 1;
        }

        return (currentLongest + 1) * (currentLongest + 1);
      };

      textInfo.push({
        all: tokenSize,
        indicesA: highlightIndexA,
        indicesB: highlightIndexB,
        indicesC: highlightIndexC,
        deviationA,
        deviationB,
        deviationC,
        longestA,
        longestB,
        longestC,
        matchA,
        matchB,
        matchC,
        calculationA:
          (longestA * longestA * (matchA - 1)) /
          (penalty("a") * deviationA * Math.sqrt(Math.sqrt(tokenSize)) + 1),
        calculationB:
          (longestB * longestB * (matchB - 1)) /
          (penalty("b") * deviationB * Math.sqrt(Math.sqrt(tokenSize)) + 1),
        calculationC:
          (longestC * longestC * (matchC - 1)) /
          (penalty("c") * deviationC * Math.sqrt(Math.sqrt(tokenSize)) + 1)
      });
    });

    info[key] = {
      textInfo,
      result:
        (100.0 * (1.0 * (results[key] || {}).count)) /
          Object.values(results)
            .map(x => x.count || 0)
            .reduce((a = 0, b = 0) => a + b, 0) +
        1
    };
  });

  const calc = {};

  const calculationsA = Object.values(info)
    .map(i => i.textInfo.map(t => t.calculationA))
    .flat();
  const countResultsA = (info.a || {}).result || 0;
  const occurrenceA =
    (100 * calculationsA.reduce((a = 0, b = 0) => a + b, 0)) /
    (calculationsA.length + 1);
  const calculationsB = Object.values(info)
    .map(i => i.textInfo.map(t => t.calculationB))
    .flat();
  const countResultsB = (info.b || {}).result || 0;
  const occurrenceB =
    (100 * calculationsB.reduce((a = 0, b = 0) => a + b, 0)) /
    (calculationsB.length + 1);
  const calculationsC = Object.values(info)
    .map(i => i.textInfo.map(t => t.calculationC))
    .flat();
  const countResultsC = (info.c || {}).result || 0;
  const occurrenceC =
    (100 * calculationsC.reduce((a = 0, b = 0) => a + b, 0)) /
    (calculationsC.length + 1);

  calc.a = {
    occurrence: occurrenceA,
    searchRatio: countResultsA,
    mixed: 0.93 * occurrenceA + 0.07 * countResultsA
  };

  calc.b = {
    occurrence: occurrenceB,
    searchRatio: countResultsB,
    mixed: 0.93 * occurrenceB + 0.07 * countResultsB
  };

  calc.c = {
    occurrence: occurrenceC,
    searchRatio: countResultsC,
    mixed: 0.93 * occurrenceC + 0.07 * countResultsC
  };

  const total = Object.values(calc)
    .map(c => c.mixed)
    .reduce((a, b) => a + b, 1);

  console.log(info);
  console.log(calc);

  return (
    <Card title="Prediction">
      <div>
        {Object.keys(calc).map(key => (
          <Col span={7} offset={1}>
            <Row className="stats">
              <Col span={3}>
                <b>{key.toLocaleUpperCase()}</b>
              </Col>
              <Col span={15} offset={1}>
                <Col
                  className="stat"
                  span={Math.floor(24 * (calc[key].mixed / total).toFixed(2))}
                >
                  <br />
                </Col>
              </Col>
              <Col span={3}>{((100 * calc[key].mixed) / total).toFixed(2)}</Col>
            </Row>
          </Col>
        ))}
      </div>
    </Card>
  );
}

export default Prediction;
