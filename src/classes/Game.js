import { ENTITY_STATS } from "constants.json";
import * as _ from "utils";
import { v4 as uuidv4 } from "uuid";

const adjacencies = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
];

export default class Game {
  turn = 0;
  entities = [];
  state = null;
  sourcePosition = null;
  targetPosition = null;
  possibleTargetPositions = [];

  constructor(players, world, flush) {
    this.players = players;
    this.world = world;
    this.flush = flush;
    this.initTurn();
  }

  getCurrentPlayer() {
    return this.players[this.turn % this.players.length];
  }

  getEntitiesAt(position) {
    return position
      ? this.entities.filter(
          (entity) =>
            entity.position.x === position.x && entity.position.y === position.y
        )
      : [];
  }

  getUnitAt(position) {
    return this.getEntitiesAt(position).find(
      (entity) => entity.type !== "building"
    );
  }

  getBuildingAt(position) {
    return this.getEntitiesAt(position).find(
      (entity) => entity.type === "building"
    );
  }

  getHQPositions() {
    return this.world
      .values()
      .filter(
        ({ x, y, height }) =>
          height === 1 &&
          this.entities.every((entity) => _.dist(entity.position, { x, y }) > 1)
      );
  }

  endTurn() {
    this.sourcePosition = null;
    this.targetPosition = null;
    this.state = null;
    this.turn++;
    this.initTurn();
    this.flush();
  }

  initTurn() {
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.currency += currentPlayer.buildings.length;
    if (currentPlayer.buildings.length === 0) {
      this.possibleTargetPositions = this.getHQPositions();
    }
    currentPlayer.units.forEach((unit) => {
      unit.canMove = true;
      unit.canAct = true;
    });
    currentPlayer.buildings.forEach((unit) => {
      unit.canAct = true;
    });
  }

  select(position) {
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.buildings.length === 0) {
      // Initialization
      this.targetPosition = position;
      this.possibleTargetPositions = this.getHQPositions();
      if (this.targetPosition) {
        this.state = "hq-building";
      } else {
        this.state = null;
      }
    } else {
      // Main
      switch (this.state) {
        case null:
          this.sourcePosition = position;
          break;
        case "moving":
        case "acting":
          this.targetPosition = position;
          if (!position) {
            this.state = null;
            this.possibleTargetPositions = [];
          }
          break;
        default:
          break;
      }
    }
    this.flush();
  }

  setState(state) {
    this.state = state;
    const sourceEntity = this.getUnitAt(this.sourcePosition);
    switch (this.state) {
      case "moving":
        this.possibleTargetPositions = this.getPositionsWithinDistance(
          this.sourcePosition,
          sourceEntity.speed,
          true
        );
        break;
      case "acting":
        this.possibleTargetPositions = this.getPositionsWithinDistance(
          this.sourcePosition,
          sourceEntity.range,
          false
        );
        switch (sourceEntity.type) {
          case "melee":
          case "range":
            this.possibleTargetPositions = this.possibleTargetPositions.filter(
              (p) => this.getEntitiesAt(p).length > 0
            );
            break;
          case "healer":
            this.possibleTargetPositions = this.possibleTargetPositions.filter(
              (p) => this.getUnitAt(p)
            );
            break;
          case "builder":
            this.possibleTargetPositions = this.possibleTargetPositions.filter(
              (p) => this.getEntitiesAt(p).length === 0
            );
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    this.flush();
  }

  buildEntity(entityType, sourceEntity, position) {
    const level = sourceEntity?.level ?? 0;
    const currentPlayer = this.getCurrentPlayer();
    const isHQ =
      currentPlayer.buildings.length === 0 && entityType === "building";
    currentPlayer.currency -= ENTITY_STATS[entityType][level].price;
    const newEntity = {
      id: uuidv4(),
      type: entityType,
      level,
      position: {
        x: position.x,
        y: position.y,
      },
      player: currentPlayer,
      ...ENTITY_STATS[entityType][level],
    };
    newEntity.health = newEntity.maxHealth;
    this.entities.push(newEntity);
    if (entityType === "building") {
      currentPlayer.buildings.push(newEntity);
    } else {
      currentPlayer.units.push(newEntity);
    }
    if (sourceEntity) {
      sourceEntity.canAct = false;
    }
    this.state = null;
    this.sourcePosition = null;
    this.targetPosition = null;
    this.possibleTargetPositions = [];
    if (isHQ) {
      this.endTurn();
    } else {
      this.flush();
    }
  }

  getPositionsWithinDistance(source, distance, collide) {
    const protrude = (positions) =>
      positions.reduce(
        (reachablePositions, position) => [
          ...reachablePositions,
          ...adjacencies
            .map(({ dx, dy }) => ({
              x: position.x + dx,
              y: position.y + dy,
            }))
            .filter(
              (p) =>
                this.world.at(p.x, p.y) === 1 &&
                reachablePositions.every((other) => _.dist(p, other) > 0) &&
                !this.getUnitAt(p)
            ),
        ],
        positions
      );
    return collide
      ? _.repeat(protrude, distance, [source]).filter(
          (p) => _.dist(p, source) > 0
        )
      : this.world
          .values()
          .filter(
            (p) =>
              p.height === 1 &&
              _.dist(p, source) <= distance &&
              _.dist(p, source) > 0
          );
  }

  move(unit, to) {
    unit.position = to;
    unit.canMove = false;

    this.state = null;
    this.sourcePosition = null;
    this.targetPosition = null;
    this.possibleTargetPositions = [];
    this.flush();
  }

  attack(object, subject) {
    object.canAct = false;
    subject.health -= object.power;
    if (subject.health <= 0) {
      if (subject.type === "building") {
        subject.player = object.player;
        object.health = object.maxHealth;
      }
    }
    this.entities = this.entities.filter((entity) => entity.health > 0);
    this.players.forEach((player) => {
      player.units = player.units.filter((entity) => entity.health > 0);
      player.buildings = player.buildings.filter((entity) => entity.health > 0);
      if (player.units.length === 0 && player.buildings.length === 0) {
        player.isDead = true;
      }
    });

    if (this.players.filter((player) => !player.isDead).length <= 1) {
      this.state = "finished";
    } else {
      this.state = null;
    }
    this.sourcePosition = null;
    this.targetPosition = null;
    this.possibleTargetPositions = [];
    this.flush();
  }

  heal(object, subject) {
    object.canAct = false;
    subject.health = Math.min(subject.health + object.power, subject.maxHealth);

    this.state = null;
    this.sourcePosition = null;
    this.targetPosition = null;
    this.possibleTargetPositions = [];
    this.flush();
  }

  upgrade(entity) {
    entity.canAct = false;
    const prevStats = ENTITY_STATS[entity.type][entity.level];
    entity.level += 1;
    const nextStats = ENTITY_STATS[entity.type][entity.level];
    Object.keys(nextStats).forEach((stat) => {
      entity[stat] = nextStats[stat];
    });
    entity.health += nextStats.maxHealth - prevStats.maxHealth;

    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.currency -= ENTITY_STATS[entity.type][entity.level].price;

    this.state = null;
    this.sourcePosition = null;
    this.targetPosition = null;
    this.possibleTargetPositions = [];
    this.flush();
  }
}
