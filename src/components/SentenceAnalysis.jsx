import React from "react";
import { Card, Col, Row, Statistic, Tag } from "antd";
import { CHARACTERS } from "./utils";

function SentenceAnalysis(props) {
  const { detectionResults } = props;
  const {
    info = {},
    question = CHARACTERS.EMPTY,
    spelling = []
  } = detectionResults;

  return (
    <div>
      <Row>
        <Card className="question-analysis">
          {question.split(" ").map(word => {
            const wordL = word.toLocaleLowerCase();
            const found = spelling.find(x =>
              wordL.includes(x.stem.toLocaleLowerCase())
            );
            if (found) {
              if (found.types.includes("Unk")) {
                return <Tag color="#f50">{word}</Tag>;
              }
              return <Tag color="#87d068">{word}</Tag>;
            } else {
              return word;
            }
          })}
        </Card>
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Words"
              value={info.word || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Symbols"
              value={info.symbols}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Letters"
              value={info.letter || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Vowels"
              value={info.vowels || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Consonants"
              value={info.consonants || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Turkish Letters"
              value={info.turkish || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Turkish Vowels"
              value={info.trVowels || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Turkish Consonants"
              value={info.trConsonants || 0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SentenceAnalysis;
