import React from "react";
import { GameContext } from "contexts";
import useGame from "hooks/useGame";

const GameProvider = ({ children }) => {
  const value = useGame();

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameProvider;
