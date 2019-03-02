import React from "react";

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

function SearchContainer(props) {
  const { q, s } = props;
  const { question = "", choices = {} } = q;

  const { a = 1, b = 1, c = 1 } = s;

  const ratio1 = a / (a + b + c);
  const ratio2 = b / (a + b + c);
  const ratio3 = c / (a + b + c);

  return (
    <div className="questionCardContainer">
      <div className="questionContainer">
        <p>{question}</p>
      </div>
      <div className="choicesContainer">
        <div className="choiceContainer">
          <p>
            {choices.a} - {a}
          </p>
          <StatusBar ratio={ratio1} />
        </div>
        <div className="choiceContainer">
          <p>
            {choices.b} - {b}
          </p>
          <StatusBar ratio={ratio2} />
        </div>
        <div className="choiceContainer">
          <p>
            {choices.c} - {c}
          </p>
          <StatusBar ratio={ratio3} />
        </div>
      </div>
    </div>
  );
}

export default SearchContainer;
