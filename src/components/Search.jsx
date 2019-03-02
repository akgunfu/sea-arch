import React, { useState } from "react";
import { api } from "../helpers/api";
import * as config from "../config/client";
import { Spin, message } from "antd";

const StatusBar = props => {
  const { ratio = 0.5 } = props;
  const a = ratio * 100;
  const b = a.toString() + "%";

  return (
    <div style={{ height: 30, display: "block" }}>
      <div style={{ width: b, backgroundColor: "chartreuse", height: 30 }}>
        {" "}
      </div>
    </div>
  );
};

const asa = (text = "") => {
  let numb = text.match(/\d/g);
  numb = numb.join("");
  return parseInt(numb);
};

function SearchContainer(props) {
  console.log(props);
  const { q } = props;
  const { question = "", choices = {} } = q;
  const { a = "", b = "", c = "" } = choices;

  console.log(question, choices, a, b, c);

  const [que, setQuestion] = useState(question);
  const [choice1, setChoice1] = useState(a);
  const [choice2, setChoice2] = useState(b);
  const [choice3, setChoice3] = useState(c);

  const [fetching, setFetching] = useState(false);
  const [stats, setStats] = useState({ a1: 0, a2: 0, a3: 0 });

  const search = () => {
    setFetching(true);
    api
      .post(config.endpoint + "search", {
        question: que,
        choice1,
        choice2,
        choice3
      })
      .then(a => {
        console.log(a);
        setFetching(false);
        setStats({
          a1: asa(a.data.a1),
          a2: asa(a.data.a2),
          a3: asa(a.data.a3)
        });
      })
      .catch(e => {
        message.error("Hata oluştu");
        setFetching(false);
      });
  };

  const { a1, a2, a3 } = stats;

  const ratio1 = a1 / (a1 + a2 + a3);
  const ratio2 = a2 / (a1 + a2 + a3);
  const ratio3 = a3 / (a1 + a2 + a3);

  console.log(ratio1, ratio2, ratio3);

  return (
    <Spin spinning={fetching}>
      <div className="questionCardContainer">
        <div className="questionContainer">
          <p>{que}</p>
        </div>
        <div className="choicesContainer">
          <div className="choiceContainer">
            <p>{choice1}</p>
            <StatusBar ratio={a1 / (a1 + a2 + a3)} />
          </div>
          <div className="choiceContainer">
            <p>{choice2}</p>
            <StatusBar ratio={a2 / (a1 + a2 + a3)} />
          </div>
          <div className="choiceContainer">
            <p>{choice3}</p>
            <StatusBar ratio={a3 / (a1 + a2 + a3)} />
          </div>
        </div>
        <button onClick={search}>Start</button>
      </div>
    </Spin>
  );
}

export default SearchContainer;
