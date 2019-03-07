import React from "react";
import { Spin } from "antd";

function ReverseResults(props) {
  const { results, fetching = false } = props;
  const { prediction = "", top = [], preview = [] } = results;

  return (
    <Spin spinning={fetching}>
      <div className="reverse-results-container">
        <h1>{prediction}</h1>
        <div className="reverse-top-results">
          {top.map(t => (
            <p>{t}</p>
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
