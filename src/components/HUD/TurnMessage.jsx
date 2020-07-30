import React, { useEffect, useState } from "react";
import useGameContext from "hooks/useGameContext";

export default () => {
  const [state, setState] = useState("");
  const game = useGameContext();
  const currentPlayer = game.getCurrentPlayer();

  useEffect(() => {
    setState("in");
    const t1 = setTimeout(() => setState("out"), 1000);
    const t2 = setTimeout(() => setState(""), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [game.turn]);

  return (
    <div
      className={`bg-${currentPlayer.color} p-8 text-center hud__turn-banner hud__turn-banner--${state}`}
    >
      <p className="text-lg font-bold">Player {currentPlayer.nth}</p>
      <p className="opacity-50 text-sm">Turn {game.turn + 1}</p>
    </div>
  );
};
