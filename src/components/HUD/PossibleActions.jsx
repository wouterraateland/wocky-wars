import { ENTITY_STATS } from "constants.json";

import React from "react";
import useGameContext from "hooks/useGameContext";

import * as Icons from "components/Icons";
import Action from "./Action";

export default () => {
  const game = useGameContext();
  const currentPlayer = game.getCurrentPlayer();
  const sourceUnit = game.getUnitAt(game.sourcePosition);
  const sourceBuilding = game.getBuildingAt(game.sourcePosition);
  const targetUnit = game.getUnitAt(game.targetPosition);
  const targetBuilding = game.getBuildingAt(game.targetPosition);

  switch (game.state) {
    case "moving":
      return (
        <>
          <Action
            graphic={<Icons.Undo size={2} />}
            onClick={() => game.select(null)}
            label="Back"
          />
          {game.targetPosition && (
            <Action
              graphic={<Icons.Check size={2} />}
              onClick={() => game.move(sourceUnit, game.targetPosition)}
              label="Confirm move"
            />
          )}
        </>
      );
    case "acting":
      switch (sourceUnit?.type || sourceBuilding?.type) {
        case "healer":
          return (
            <>
              <Action
                graphic={<Icons.Undo size={2} />}
                onClick={() => game.select(null)}
                label="Back"
              />
              {game.targetPosition && (
                <Action
                  graphic={<Icons.Check size={2} />}
                  onClick={() => game.heal(sourceUnit, targetUnit)}
                  disabled={!targetUnit}
                  label="Confirm heal"
                />
              )}
            </>
          );
        case "melee":
        case "range":
          return (
            <>
              <Action
                graphic={<Icons.Undo size={2} />}
                onClick={() => game.select(null)}
                label="Back"
              />
              {game.targetPosition && (
                <Action
                  graphic={<Icons.Check size={2} />}
                  onClick={() =>
                    game.attack(sourceUnit, targetUnit || targetBuilding)
                  }
                  disabled={!targetUnit && !targetBuilding}
                  label="Confirm attack"
                />
              )}
            </>
          );
        case "builder":
          return (
            <>
              <Action
                graphic={<Icons.Undo size={2} />}
                label="Back"
                onClick={() => game.select(null)}
              />
              {game.targetPosition && (
                <Action
                  graphic={<Icons.Home size={2} />}
                  label="Build camp"
                  price={ENTITY_STATS["building"][sourceUnit.level].price}
                  onClick={() =>
                    game.buildEntity(
                      "building",
                      sourceUnit,
                      game.targetPosition
                    )
                  }
                  disabled={targetBuilding}
                />
              )}
            </>
          );
        default:
          return null;
      }
    case "hq-building":
      return (
        <Action
          graphic={<Icons.Home size={2} />}
          label="Build HQ"
          price={ENTITY_STATS["building"][0].price}
          onClick={() =>
            game.buildEntity("building", null, game.targetPosition)
          }
        />
      );
    case "finished":
      return (
        <Action
          graphic={<Icons.Repeat size={2} />}
          label="Restart"
          onClick={() => window.location.reload()}
        />
      );
    default:
      switch (sourceUnit?.type || sourceBuilding?.type) {
        case "melee":
        case "range":
        case "healer":
        case "builder":
          return (
            sourceUnit.player === currentPlayer && (
              <>
                <Action
                  graphic={<Icons.Undo size={2} />}
                  label="Back"
                  onClick={() => game.select(null)}
                />
                <Action
                  graphic={<Icons.Share size={2} />}
                  label="Move"
                  onClick={() => game.setState("moving")}
                  disabled={!sourceUnit.canMove}
                />
                <Action
                  graphic={<Icons.Cross size={2} />}
                  label={
                    sourceUnit.type === "melee"
                      ? "Attack"
                      : sourceUnit.type === "range"
                      ? "Attack"
                      : sourceUnit.type === "healer"
                      ? "Heal"
                      : "Build"
                  }
                  onClick={() => game.setState("acting")}
                  disabled={!sourceUnit.canAct}
                />
                {sourceUnit.level + 1 <
                  ENTITY_STATS[sourceUnit.type].length && (
                  <Action
                    graphic={<Icons.Arrow size={2} direction="up" />}
                    label={
                      <>
                        {sourceUnit.level + 1} &rarr; {sourceUnit.level + 2}
                      </>
                    }
                    price={
                      ENTITY_STATS[sourceUnit.type][sourceUnit.level + 1].price
                    }
                    onClick={() => game.upgrade(sourceUnit)}
                    disabled={!sourceUnit.canAct}
                  />
                )}
              </>
            )
          );
        case "building":
          return (
            sourceBuilding.player === currentPlayer && (
              <>
                <Action
                  graphic={<Icons.Undo size={2} />}
                  label="Back"
                  onClick={() => game.select(null)}
                />
                <Action
                  graphic={<Icons.Cross size={2} />}
                  label="Build Melee"
                  price={ENTITY_STATS["melee"][sourceBuilding.level].price}
                  onClick={() =>
                    game.buildEntity(
                      "melee",
                      sourceBuilding,
                      game.sourcePosition
                    )
                  }
                  disabled={sourceUnit}
                />
                <Action
                  graphic={<Icons.Arrow size={2} />}
                  label="Build Range"
                  onClick={() =>
                    game.buildEntity(
                      "range",
                      sourceBuilding,
                      game.sourcePosition
                    )
                  }
                  disabled={sourceUnit}
                  price={ENTITY_STATS["range"][sourceBuilding.level].price}
                />
                <Action
                  graphic={<Icons.Plus size={2} />}
                  label="Build Healer"
                  onClick={() =>
                    game.buildEntity(
                      "healer",
                      sourceBuilding,
                      game.sourcePosition
                    )
                  }
                  disabled={sourceUnit}
                  price={ENTITY_STATS["healer"][sourceBuilding.level].price}
                />
                <Action
                  graphic={<Icons.Cog size={2} />}
                  label="Build Builder"
                  onClick={() =>
                    game.buildEntity(
                      "builder",
                      sourceBuilding,
                      game.sourcePosition
                    )
                  }
                  disabled={sourceUnit}
                  price={ENTITY_STATS["builder"][sourceBuilding.level].price}
                />
                {sourceBuilding.level + 1 < ENTITY_STATS["building"].length && (
                  <Action
                    graphic={<Icons.Arrow size={2} direction="up" />}
                    label={
                      <>
                        {sourceBuilding.level + 1} &rarr;{" "}
                        {sourceBuilding.level + 2}
                      </>
                    }
                    price={
                      ENTITY_STATS["building"][sourceBuilding.level + 1].price
                    }
                    onClick={() => game.upgrade(sourceBuilding)}
                    disabled={!sourceBuilding.canAct}
                  />
                )}
              </>
            )
          );
        default:
          return (
            currentPlayer.buildings.length > 0 && (
              <Action
                graphic={<Icons.Door size={2} />}
                label="End turn"
                onClick={() => game.endTurn()}
              />
            )
          );
      }
  }
};
