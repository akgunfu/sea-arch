import React from "react";
import { Button, Timeline } from "antd";

function History(props) {
  const { events = [], onStart } = props;

  const started = events.length > 0;

  return started ? (
    <div>
      <Button type="primary" size="large" onClick={onStart}>
        Start
      </Button>
      <Timeline pending={events[events.length - 1].description}>
        {events.map(event => (
          <Timeline.Item color={event.success ? "green" : "red"}>
            {event.description}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  ) : (
    <div>
      <Button type="primary" size="large" onClick={onStart}>
        Start
      </Button>
    </div>
  );
}

export default History;
