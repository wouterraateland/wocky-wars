import "./Entity.scss";
import { GRID_SIZE } from "constants.json";
import cx from "classnames";

import React, { useRef } from "react";
import useGameContext from "hooks/useGameContext";

import * as Icons from "components/Icons";
import { ToolTip } from "components/UI";
import HealthBar from "./HealthBar";

const getIcon = (type) => {
  switch (type) {
    case "melee":
      return <Icons.Cross size={0.75} />;
    case "range":
      return <Icons.Arrow size={0.75} />;
    case "healer":
      return <Icons.Plus size={0.75} />;
    case "builder":
      return <Icons.Cog size={0.75} />;
    case "building":
      return <div className="relative entity--building w-full h-full" />;
    default:
      return "?";
  }
};

export default ({ entity }) => {
  const game = useGameContext();
  const originRef = useRef(null);

  return (
    <>
      <button
        ref={originRef}
        className={cx(
          "entity absolute flex justify-center p-0 border-none",
          entity.type === "building"
            ? `items-flex-start w-8 h-8 bg-transparent text-${entity.player.color}`
            : `items-center w-4 h-4 m-2 rounded-full bg-${entity.player.color}`,
          { "entity--used": !entity.canMove && !entity.canAct }
        )}
        style={{
          transform: `translate(${entity.position.x * GRID_SIZE}px, ${
            entity.position.y * GRID_SIZE
          }px)`,
          zIndex: (entity.type === "building" ? 0 : 10) + entity.position.y,
        }}
        onClick={
          game.possibleTargetPositions.length === 0
            ? () => game.select(entity.position)
            : null
        }
      >
        {getIcon(entity.type)}
        <HealthBar health={entity.health} maxHealth={entity.maxHealth} />
      </button>
      <ToolTip originRef={originRef}>
        <p className="capitalize font-bold">{entity.type}</p>
        <p>Level {entity.level + 1}</p>
        <p>
          Health: {entity.health} / {entity.maxHealth}
        </p>
        {entity.speed && <p>Speed: {entity.speed}</p>}
        {entity.power && <p>Atk power: {entity.power}</p>}
        {entity.range && <p>Atk range: {entity.range}</p>}
      </ToolTip>
    </>
  );
};
