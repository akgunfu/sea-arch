import React from "react";
import { Card, Col, Row } from "antd";

const deviation = (indices = []) => {
  if (indices.length < 2) {
    return 0;
  }

  const mean = (1.0 * indices.reduce((a, b) => a + b, 0)) / indices.length;
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
        match = 0;
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

    let allKeywords = [
      ...(choices[key] || "").split(" "),
      ...nlp.split(" "),
      ...used.split(" "),
      ...question.split(" ")
    ];

    allKeywords = allKeywords.filter(a => a.length > 1);

    const textInfo = [];
    texts.forEach(text => {
      let words = text.split(" ");
      words = words.filter(w => w.length > 1 && ![".", ",", "..."].includes(w));
      const tokenSize = words.length;

      const highlightIndex = [];
      let highlightCount = 0;
      words.forEach((word, i) => {
        allKeywords.forEach(keyword => {
          if (word.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
            highlightIndex.push(i);
            highlightCount = highlightCount + 1;
          }
        });
      });

      const uniqueIndices = [...new Set(highlightIndex)];
      textInfo.push({
        indices: uniqueIndices,
        deviation: deviation(uniqueIndices),
        longest: longestMatch(uniqueIndices),
        all: tokenSize,
        match: highlightCount
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
  Object.keys(info).forEach(key => {
    const value = info[key];

    const raw =
      value.textInfo
        .map(p => (p.longest * p.match) / (p.deviation * Math.sqrt(p.all) + 1))
        .reduce((a, b) => a + b, 0) /
      (value.textInfo.length + 1);

    const rows = value.textInfo.length;
    const countRatio = Math.sqrt(Math.sqrt(value.result));

    const occurrenceRatio = raw * rows * 0.85;
    const resultRatio = countRatio * 0.15;
    const mixed = resultRatio + occurrenceRatio;

    calc[key] = {
      occurrenceRatio,
      resultRatio,
      mixed
    };
  });

  const go = calc.a && calc.b && calc.c;

  const total = Object.values(calc)
    .map(c => c.mixed)
    .reduce((a, b) => a + b, 0);

  return (
    <Card title="Prediction">
      {go && (
        <Row>
          {Object.keys(calc)
            .sort((a, b) => calc[b].mixed - calc[a].mixed)
            .map(key => (
              <Col span={7} offset={1}>
                <h2 key={key}>
                  {key.toLocaleUpperCase()} :{" "}
                  {((100 * calc[key].mixed) / total).toFixed(2)} %
                </h2>
              </Col>
            ))}
        </Row>
      )}
      {!go && <p>Not Yet</p>}
    </Card>
  );
}

export default Prediction;
