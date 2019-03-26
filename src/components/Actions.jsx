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
    <Spin spinning={spinning}>
      <Card>
        <Row gutter={15}>
          <Col span={8}>
            <Button
              className="spaced"
              icon="file-text"
              type="primary"
              size="large"
              onClick={onStartSearch}
              block
            >
              Text Search
            </Button>
          </Col>
          <Col span={8}>
            <Button
              className="spaced"
              icon="picture"
              type="primary"
              size="large"
              onClick={onStartReverseSearch}
              block
            >
              Image Search
            </Button>
          </Col>
          <Col span={8}>
            <Button
              className="spaced"
              icon="idcard"
              type="primary"
              size="large"
              onClick={onStartKeywordSearch}
              block
            >
              Keyword Search
            </Button>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={8}>
            <Button
              className="spaced"
              icon="highlight"
              type="primary"
              size="large"
              onClick={onStartSentenceAnalysis}
              block
            >
              Sentence Analysis
            </Button>
          </Col>
          <Col span={8} />
          {replayable && (
            <Col span={8}>
              <Button
                className="spaced"
                icon="sync"
                type="primary"
                size="large"
                onClick={replay}
                block
              >
                Replay :{" "}
                {Object.values(SEARCH_MODES)[mode]
                  ? Object.values(SEARCH_MODES)[mode].name
                  : ""}
              </Button>
            </Col>
          )}
        </Row>

        {replayable && (
          <Row gutter={15}>
            <Col span={8} />
          </Row>
        )}
      </Card>
    </Spin>
  );
}

export default Actions;
