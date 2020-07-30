import React from "react";
import useGameContext from "hooks/useGameContext";

import Entity from "./Entity";

export default () => {
  const game = useGameContext();
  return game.entities.map((entity) => (
    <Entity key={entity.id} entity={entity} />
  ));
};
