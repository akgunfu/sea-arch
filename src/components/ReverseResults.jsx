import React from "react";
import { Spin } from "antd";
import Highlighter from "react-highlight-words";

function ReverseResults(props) {
  const { results, fetching = false } = props;
  const { prediction = "", top = [], preview = [] } = results;

  return (
    <Spin spinning={fetching}>
      <div className="reverse-results-container">
        <h1>{prediction}</h1>
        <div className="reverse-top-results">
          {top.map(t => (
            <Highlighter
              highlightClassName="question-keyword-match"
              searchWords={[...prediction.split(" "), ...['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']]}
              textToHighlight={t + " "}
            />
          ))}
        </div>
        <div className="reverse-occurrence-results">
          {preview.map(pr => (
            <p>{pr}</p>
          ))}
        </div>
      </div>
    </Spin>
  );
}

export default ReverseResults;
