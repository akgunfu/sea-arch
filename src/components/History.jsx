import React from "react";
import { Button, Card, Spin } from "antd";

function History(props) {
  const { onStart, spinning } = props;

  return (
    <Spin spinning={spinning}>
      <Card>
        <Button type="primary" size="large" onClick={onStart} block>
          Start
        </Button>
      </Card>
    </Spin>
  );
}

export default History;
