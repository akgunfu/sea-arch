import React from "react";
import { Card, Col, Row } from "antd";

import SOLAR from "../assets/images/Solar.png";

import SUN from "../assets/images/Sun.gif";

import MERCURY from "../assets/images/Mercury.gif";
import VENUS from "../assets/images/Venus.gif";
import EARTH from "../assets/images/Earth.gif";
import MARS from "../assets/images/Mars.gif";
import JUPITER from "../assets/images/Jupiter.gif";
import SATURN from "../assets/images/Saturn.gif";
import URANUS from "../assets/images/Uranus.gif";
import NEPTUNE from "../assets/images/Neptune.gif";

import CERES from "../assets/images/Ceres.gif";
import PLUTO from "../assets/images/Pluto.gif";

function Space() {
  return (
    <div>
      <Row>
        <Col span={18} offset={3}>
          <Card>
            <img src={SOLAR} className="card-image" />
          </Card>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={8} />
        <Col span={8}>
          <Card>
            <img src={SUN} className="card-image" />
          </Card>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={8}>
          <Card>
            <img src={MERCURY} className="card-image" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <img src={VENUS} className="card-image" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <img src={EARTH} className="card-image" />
          </Card>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={8}>
          <Card>
            <img src={MARS} className="card-image" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <img src={JUPITER} className="card-image" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <img src={SATURN} className="card-image" />
          </Card>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={8}>
          <Card>
            <img src={URANUS} className="card-image" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <img src={NEPTUNE} className="card-image" />
          </Card>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={8}>
          <Card>
            <img src={CERES} className="card-image" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <img src={PLUTO} className="card-image" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Space;
