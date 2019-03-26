import React from "react";
import { Col, Input, Modal, Row, Tag } from "antd";

const TAG_COLORS = [
  "red",
  "magenta",
  "blue",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "geekblue",
  "purple"
];

const KEYWORDS = [
  "age",
  "birthday",
  "birthplace",
  "known for",
  "population",
  "area",
  "president",
  "population density",
  "area",
  "currency",
  "external debt",
  "capital",
  "release date",
  "producer",
  "director",
  "cast",
  "writer",
  "composer",
  "recorded in",
  "album",
  "distance",
  "calories",
  "length",
  "height"
];

const KEYWORD_PER_ROW = 4;

function KeywordModal(props) {
  const { visible = false, close, onChangeKeyword, submit, keyword } = props;

  const Keyword = props => {
    const { value } = props;

    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

    return (
      <Tag
        color={color}
        onClick={() => {
          onChangeKeyword(value);
          submit();
        }}
      >
        {value}
      </Tag>
    );
  };

  const row_count =
    Math.floor(KEYWORDS.length / KEYWORD_PER_ROW) +
    (KEYWORDS.length % KEYWORD_PER_ROW !== 0 ? 1 : 0);

  return (
    <Modal visible={visible} footer={null} onCancel={close} destroyOnClose>
      <br />
      <br />
      <Row>
        <Col span={12} offset={6}>
          <Input
            autoFocus
            value={keyword}
            placeholder="Enter keyword"
            onChange={e => onChangeKeyword(e.target.value)}
            onPressEnter={submit}
          />
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        {[...Array(row_count).keys()].map(r => {
          return (
            <div>
              <Row gutter={10} key={r}>
                {[...Array(KEYWORD_PER_ROW).keys()].map(i => {
                  if (KEYWORD_PER_ROW * r + i < KEYWORDS.length) {
                    return (
                      <Col
                        span={Math.floor(24 / KEYWORD_PER_ROW)}
                        key={r.toString() + i.toString()}
                      >
                        <Keyword value={KEYWORDS[KEYWORD_PER_ROW * r + i]} />
                      </Col>
                    );
                  } else {
                    return "";
                  }
                })}
              </Row>
              <br />
            </div>
          );
        })}
      </Row>
    </Modal>
  );
}

export default KeywordModal;
