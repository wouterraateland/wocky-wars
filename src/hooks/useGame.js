import Game from "classes/Game";
import Player from "classes/Player";
import World from "classes/World";

import { useState } from "react";
import useForceUpdate from "hooks/useForceUpdate";

export default ({ players, subdivisions }) => {
  const forceUpdate = useForceUpdate();
  const [game] = useState(
    new Game(
      Array(players)
        .fill()
        .map((_, i) => Player.create(i + 1)),
      World.create(subdivisions),
      forceUpdate
    )
  );

  return game;
};
