import React from "react";
import { Button, Timeline, Card } from "antd";

function History(props) {
  const { events = [], onStart } = props;

  const started = events.length > 0;

  return started ? (
    <Card className="actions">
      <Button type="primary" size="large" onClick={onStart} block>
        Start
      </Button>
      <Timeline pending={events[events.length - 1].description} style={{marginTop: 40}}>
        {events.map(event => (
          <Timeline.Item color={event.success ? "green" : "red"}>
            {event.description}
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  ) : (
    <Card>
      <Button type="primary" size="large" onClick={onStart} block>
        Start
      </Button>
    </Card>
  );
}

export default History;
