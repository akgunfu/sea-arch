import React from "react";
import { Button, Card, Col, Row, Spin } from "antd";
import { SEARCH_MODES } from "./Dashboard";

function Actions(props) {
  const {
    onStartSearch,
    onStartReverseSearch,
    onStartKeywordSearch,
    onStartSentenceAnalysis,
    spinning,
    mode,
    replay,
    replayable
  } = props;

  return (
    <Row gutter={15}>
      <Col span={4}>
        <Spin spinning={spinning}>
          <Button
            className="spaced"
            icon="file-text"
            type="primary"
            size="large"
            onClick={onStartSearch}
            block
          />
        </Spin>
      </Col>
      <Col span={4}>
        <Spin spinning={spinning}>
          <Button
            className="spaced"
            icon="picture"
            type="primary"
            size="large"
            onClick={onStartReverseSearch}
            block
          />
        </Spin>
      </Col>
      <Col span={4}>
        <Spin spinning={spinning}>
          <Button
            className="spaced"
            icon="idcard"
            type="primary"
            size="large"
            onClick={onStartKeywordSearch}
            block
          />
        </Spin>
      </Col>
      <Col span={4}>
        <Spin spinning={spinning}>
          <Button
            className="spaced"
            icon="highlight"
            type="primary"
            size="large"
            onClick={onStartSentenceAnalysis}
            block
          />
        </Spin>
      </Col>
      <Col span={4} />
      {replayable && (
        <Col span={4}>
          <Spin spinning={spinning}>
            <Button
              className="spaced"
              icon="sync"
              type="primary"
              size="large"
              onClick={replay}
              block
            />
          </Spin>
        </Col>
      )}
    </Row>
  );
}

export default Actions;
