import React from "react";
import { useParams } from "react-router-dom";
import useGame from "hooks/useGame";

import { GameContext } from "contexts";

export default (Component) => (props) => {
  const { players, subdivisions } = useParams();
  const value = useGame({
    players: parseInt(players, 10),
    subdivisions: parseInt(subdivisions, 10),
  });

  return (
    <GameContext.Provider value={value}>
      <Component {...props} />
    </GameContext.Provider>
  );
};
