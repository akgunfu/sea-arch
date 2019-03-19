import React from "react";

import TR_STATES from "../assets/images/tr_states.png";
import TR_PLATES_MAP from "../assets/images/tr-plates.png";
import TR_PLATES_TABLE from "../assets/images/tr-plates-table.png";
import WORLD_MAP from "../assets/images/world-map.gif";
import { Icon, Tabs } from "antd";

const TabPane = Tabs.TabPane;

function Maps() {
  return (
    <Tabs>
      <TabPane
        tab={
          <span>
            <Icon type="environment" />
            Turkey
          </span>
        }
        key="1"
      >
        <img className="extra-image" src={TR_STATES} alt="TR_STATES" />
        <img className="extra-image" src={TR_PLATES_MAP} alt="TR_PLATES_MAP" />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="global" />
            World
          </span>
        }
        key="2"
      >
        <img className="extra-image" src={WORLD_MAP} alt="WORLD_MAP" />
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="car" />
            Plates
          </span>
        }
        key="3"
      >
        <img
          className="extra-image"
          src={TR_PLATES_TABLE}
          alt="TR_PLATES_TABLE"
        />
      </TabPane>
    </Tabs>
  );
}

export default Maps;
