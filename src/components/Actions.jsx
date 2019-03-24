import React from "react";
import { Button, Card, Spin } from "antd";

function Actions(props) {
  const {
    onStartSearch,
    onStartReverseSearch,
    onStartKeywordSearch,
    spinning
  } = props;

  return (
    <Spin spinning={spinning}>
      <Card>
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
        <Button
          className="spaced"
          icon="picture"
          type="primary"
          size="large"
          onClick={onStartKeywordSearch}
          block
        >
          Keyword Search
        </Button>
      </Card>
    </Spin>
  );
}

export default Actions;
