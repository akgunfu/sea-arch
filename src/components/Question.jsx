import React from "react";
import { Card } from "antd";

function Question(props) {
  const { detection } = props;
  const { question = "", choices = {} } = detection;

  return (
    <Card title="Detection Results">
      <div className="card-question">{question}</div>
      <div className="card-answers">
        <div className="card-answer">{choices.a || ""}</div>
        <div className="card-answer">{choices.b || ""}</div>
        <div className="card-answer">{choices.c || ""}</div>
      </div>
    </Card>
  );
}

export default Question;
