import React from "react";
import useGameContext from "hooks/useGameContext";

export default () => {
  const game = useGameContext();
  const currentPlayer = game.getCurrentPlayer();
  const sourceUnit = game.getUnitAt(game.sourcePosition);

  switch (game.state) {
    case "moving":
      return "Move to any of the marked squares";
    case "acting":
      switch (sourceUnit.type) {
        case "healer":
          return "Move to any of the marked squares";
        case "melee":
        case "range":
          return "Attack any of the marked squares";
        case "builder":
          return "Build at any of the marked squares";
        default:
          return "Click any of the marked squares to act there";
      }
    case "building":
      return "Select an unit to build";
    case "finished": {
      const winningPlayer = game.players.find((player) => !player.isDead);
      return `Player ${winningPlayer.nth} is victorious!`;
    }
    default:
      return currentPlayer.buildings.length === 0 ? (
        <>
          Player {currentPlayer.nth}. Select a position on the map to build your
          headquarters.
        </>
      ) : (
        <span className="flex justify-space-between space-x-2">
          <span>
            <span
              className={`inline-block w-4 h-4 rounded-full bg-${currentPlayer.color}`}
            />{" "}
            Player {currentPlayer.nth}
          </span>
          <span>${currentPlayer.currency}</span>
        </span>
      );
  }
};
