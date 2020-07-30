import React from "react";
import useGameContext from "hooks/useGameContext";

import Marker from "components/Marker";

export default () => {
  const game = useGameContext();
  return (
    game.targetPosition && (
      <Marker
        onClick={() => game.select(null)}
        isActive
        position={game.targetPosition}
      />
    )
  );
};
