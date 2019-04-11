import React, { useState } from "react";

import LOGO from "../assets/images/logo.png";
import { Affix, Col, Icon, Pagination, Row } from "antd";
import Actions from "./Actions";
import Prediction from "./Prediction";

function importAll(r) {
  return r.keys().map(r);
}

const ITEMS_PER_PAGE = 10;

function Header(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const images = importAll(require.context("../assets/screenshots"));
  const displayedImages = images
    .reverse()
    .slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      images.length > currentPage * ITEMS_PER_PAGE
        ? currentPage * ITEMS_PER_PAGE
        : images.length
    );

  return drawerVisible ? (
    <Affix offsetTop={0}>
      <Row className="header">
        <Col span={2} className="centered-col">
          <img src={LOGO} className="header-logo" />
        </Col>
        <Col span={10} offset={1} className="centered-col">
          <Actions {...props} />
        </Col>
        <Col span={10} offset={1} className="centered-col">
          <Prediction {...props} />
        </Col>
      </Row>
      {displayedImages.length > 0 && (
        <div className="preview-image-container">
          {displayedImages.map(image => (
            <img className="preview-image" src={image} />
          ))}
          <Pagination
            size="small"
            total={images.length}
            pageSize={ITEMS_PER_PAGE}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
          />
        </div>
      )}
      <Row className="header-expand" onClick={() => setDrawerVisible(false)}>
        <Icon type="caret-up" />
      </Row>
    </Affix>
  ) : (
    <Affix offsetTop={0}>
      <Row className="header">
        <Col span={2} className="centered-col">
          <img src={LOGO} className="header-logo" />
        </Col>
        <Col span={10} offset={1} className="centered-col">
          <Actions {...props} />
        </Col>
        <Col span={10} offset={1} className="centered-col">
          <Prediction {...props} />
        </Col>
      </Row>
      <Row className="header-expand" onClick={() => setDrawerVisible(true)}>
        <Icon type="caret-down" />
      </Row>
    </Affix>
  );
}

export default Header;
