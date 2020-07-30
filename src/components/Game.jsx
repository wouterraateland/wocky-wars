import "./Game.scss";

import React from "react";

import WorldMap from "components/WorldMap";
import PossibleTargetPositions from "components/PossibleTargetPositions";
import Entities from "components/Entities";
import TargetPosition from "components/TargetPosition";
import HUD from "components/HUD";

export default () => (
  <div className="game__container">
    <WorldMap>
      <PossibleTargetPositions />
      <Entities />
      <TargetPosition />
    </WorldMap>
    <HUD />
  </div>
);
