import React from "react";
import OTTOMAN_TIMELINE from "../../assets/images/ottoman-timeline.png";
import OTTOMANS from "../../assets/images/ottoman.png";

function Ottomans() {
  return (
    <div>
      <img
        className="extra-image"
        src={OTTOMAN_TIMELINE}
        alt="OTTOMAN_TIMELINE"
      />
      <img className="extra-image" src={OTTOMANS} alt="OTTOMANS" />
    </div>
  );
}

export default Ottomans;
