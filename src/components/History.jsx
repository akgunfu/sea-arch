import React from "react";
import { Button, Card, Spin } from "antd";

function History(props) {
  const {
    onStartSearch,
    onStartReverseSearch,
    spinning,
    query = "",
    setQuery
  } = props;

  return (
    <Spin spinning={spinning}>
      <Card>
        <input
          className="query-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Extra query (optional)"
        />
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
      </Card>
    </Spin>
  );
}

export default History;
