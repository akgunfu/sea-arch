import React from "react";

import LOGO from "../assets/images/logo.png";
import { Affix, Col, Row } from "antd";
import Actions from "./Actions";
import Prediction from "./Prediction";

function Header(props) {
  return (
    <Affix offset={0}>
      <Row className="header">
        <Col span={3} className="centered-col">
          <img src={LOGO} className="header-logo" />
        </Col>
        <Col span={10} offset={1} className="centered-col">
          <Actions {...props} />
        </Col>
        <Col span={9} offset={1} className="centered-col">
          <Prediction {...props} />
        </Col>
      </Row>
    </Affix>
  );
}

export default Header;
