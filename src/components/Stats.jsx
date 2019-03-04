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

  const { a = {}, b = {}, c = {} } = results;

  const cA = a.count || 0;
  const cB = b.count || 0;
  const cC = c.count || 0;

  const rA = cA / (cA + cB + cC + 1);
  const rB = cB / (cA + cB + cC + 1);
  const rC = cC / (cA + cB + cC + 1);

  return (
    <Spin spinning={fetching}>
      <Card className="stats-container" title="Search Counts">
        <img src={src} width={80} height={30} />
        <div className="stats">
          <Row className="stat-row">
            <Col span={3}>A</Col>
            <Col span={16}>
              <Col className="stat" span={Math.floor(24 * rA)}>
                <br />
              </Col>
            </Col>
            <Col span={3}>{formatNumber(cA)}</Col>
          </Row>
          <Row className="stats">
            <Col span={3}>B</Col>
            <Col span={16}>
              <Col className="stat" span={Math.floor(24 * rB)}>
                <br />
              </Col>
            </Col>
            <Col span={3}>{formatNumber(cB)}</Col>
          </Row>
          <Row className="stats">
            <Col span={3}>C</Col>
            <Col span={16}>
              <Col className="stat" span={Math.floor(24 * rC)}>
                <br />
              </Col>
            </Col>
            <Col span={3}>{formatNumber(cC)}</Col>
          </Row>
        </div>
      </Card>
    </Spin>
  );
}

export default Stats;
