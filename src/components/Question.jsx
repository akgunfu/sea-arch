import React from "react";
import { Card } from "antd";

function Question(props) {
  const { detection } = props;
  const { question = "", nlp = "", choices = {} } = detection;

  return (
    <Card title="Detection Results">
      <p>OCR</p>
      <div className="card-question">{question}</div>
      <p>NLP</p>
      <div className="card-question">{nlp}</div>
      <div className="card-answers">
        <div className="card-answer">{choices.a || ""}</div>
        <div className="card-answer">{choices.b || ""}</div>
        <div className="card-answer">{choices.c || ""}</div>
      </div>
    </Card>
  );
}

export default Question;
