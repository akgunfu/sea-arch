import React from "react";
import { Card, Col, Row, Spin } from "antd";
import Highlighter from "react-highlight-words";

function Occurrence(props) {
  const { results, detection, fetching = false } = props;

  const { choices = {} } = detection;

  const { a = {}, b = {}, c = {} } = results;

  const tA = a.text || [];
  const tB = b.text || [];
  const tC = c.text || [];

  return (
    <Spin spinning={fetching}>
      <b>{choices.a || ""} - {tA.length}</b>
      <div className="occurrences">
        <br />
        {tA.map(text => (
          <Highlighter
            highlightClassName="highlight"
            searchWords={[...(a.used || "").split(" ")]}
            autoEscape={true}
            textToHighlight={text}
          />
        ))}
      </div>
      <b>{choices.b || ""} - {tB.length}</b>
      <div className="occurrences">
        <br />
        {tB.map(text => (
          <Highlighter
            highlightClassName="highlight"
            searchWords={[...(b.used || "").split(" ")]}
            autoEscape={true}
            textToHighlight={text}
          />
        ))}
      </div>
      <b>{choices.c || ""} - {tC.length}</b>
      <div className="occurrences">
        <br />
        {tC.map(text => (
          <Highlighter
            highlightClassName="highlight"
            searchWords={[...(c.used || "").split(" ")]}
            autoEscape={true}
            textToHighlight={text}
          />
        ))}
      </div>
    </Spin>
  );
}

export default Occurrence;
