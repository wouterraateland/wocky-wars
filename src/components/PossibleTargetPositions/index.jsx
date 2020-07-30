import * as _ from "utils";
import React from "react";
import useGameContext from "hooks/useGameContext";

import Marker from "components/Marker";

export default () => {
  const game = useGameContext();
  return game.possibleTargetPositions
    .filter(
      (position) =>
        !game.targetPosition || _.dist(position, game.targetPosition) > 0
    )
    .map((position) => (
      <Marker
        key={`${position.x},${position.y}`}
        position={position}
        onClick={() => game.select(position)}
      />
    ));
};
