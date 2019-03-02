import React from "react";
import { Card, Col, Row, Spin } from "antd";

function formatNumber(number) {
  if (number >= 1000 && number < 1000000) {
    return Math.floor(number / 1000).toString() + "K";
  }
  if (number >= 1000000) {
    return Math.floor(number / 1000000).toString() + "M";
  }
  return number.toString();
}

function Stats(props) {
  const { results, src, fetching = false } = props;

  const { a = 0, b = 0, c = 0 } = results;

  const rA = a / (a + b + c + 1);
  const rB = b / (a + b + c + 1);
  const rC = c / (a + b + c + 1);

  return (
    <Spin spinning={fetching}>
      <Card className="stats-container">
        <img src={src} width={80} height={30} />
        <div className="stats">
          <Row className="stat-row">
            <Col span={3}>A</Col>
            <Col span={16}>
              <Col className="stat" span={Math.floor(24 * rA)}>
                <br />
              </Col>
            </Col>
            <Col span={3}>{formatNumber(a)}</Col>
          </Row>
          <Row className="stats">
            <Col span={3}>B</Col>
            <Col span={16}>
              <Col className="stat" span={Math.floor(24 * rB)}>
                <br />
              </Col>
            </Col>
            <Col span={3}>{formatNumber(b)}</Col>
          </Row>
          <Row className="stats">
            <Col span={3}>C</Col>
            <Col span={16}>
              <Col className="stat" span={Math.floor(24 * rC)}>
                <br />
              </Col>
            </Col>
            <Col span={3}>{formatNumber(c)}</Col>
          </Row>
        </div>
      </Card>
    </Spin>
  );
}

export default Stats;
