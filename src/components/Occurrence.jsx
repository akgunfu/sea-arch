import React from "react";
import { Spin } from "antd";
import Matcher from "./Matcher";

function Occurrence(props) {
  const { results, detection, fetching = false } = props;

  const { choices = {}, nlp = "" } = detection;

  const { a = {}, b = {}, c = {} } = results;

  const tA = a.text || [];
  const tB = b.text || [];
  const tC = c.text || [];

  return (
    <Spin spinning={fetching}>
      <div className="occurrences-a">
        <h2 className="a search-title">
          {choices.a || ""} - {tA.length}
        </h2>
        <Matcher
          questionKeywords={[
            ...(a.used || "").split(" ").filter(a => a.length > 1)
          ]}
          nlpKeywords={[...(nlp || "").split(" ").filter(a => a.length > 2)]}
          keyword={choices.a || " "}
          texts={tA}
          type="answer-keyword-match-a"
          keyword2={choices.b || " "}
          type2="answer-keyword-match-b"
          keyword3={choices.c || " "}
          type3="answer-keyword-match-c"
        />
      </div>
      <div className="occurrences-b">
        <h2 className="b search-title">
          {choices.b || ""} - {tB.length}
        </h2>
        <Matcher
          questionKeywords={[
            ...(b.used || "").split(" ").filter(a => a.length > 1)
          ]}
          nlpKeywords={[...(nlp || "").split(" ").filter(a => a.length > 2)]}
          keyword={choices.b || " "}
          texts={tB}
          type="answer-keyword-match-b"
          keyword2={choices.a || " "}
          type2="answer-keyword-match-a"
          keyword3={choices.c || " "}
          type3="answer-keyword-match-c"
        />
      </div>
      <div className="occurrences-c">
        <h2 className="c search-title">
          {choices.c || ""} - {tC.length}
        </h2>
        <Matcher
          questionKeywords={[
            ...(c.used || "").split(" ").filter(a => a.length > 1)
          ]}
          nlpKeywords={[...(nlp || "").split(" ").filter(a => a.length > 2)]}
          keyword={choices.c || " "}
          texts={tC}
          type="answer-keyword-match-c"
          keyword2={choices.a || " "}
          type2="answer-keyword-match-a"
          keyword3={choices.b || " "}
          type3="answer-keyword-match-b"
        />
      </div>
    </Spin>
  );
}

export default Occurrence;
