import React from "react";
import useGameContext from "hooks/useGameContext";

export default ({ graphic, label, price, disabled, ...props }) => {
  const game = useGameContext();
  const currentPlayer = game.getCurrentPlayer();
  return (
    <button
      className="hud__action-button relative cursor-pointer bg-card border-none flex flex-col items-center p-2 rounded-md space-y-2"
      disabled={disabled || (price && currentPlayer.currency < price)}
      {...props}
    >
      {graphic}
      <span className="text-xs">{label}</span>
      {price && (
        <span className="hud__action__price p-1 rounded-full">${price}</span>
      )}
    </button>
  );
};
