import { INITIAL_CURRENCY } from "constants.json";

const getColor = (i) => {
  switch (i) {
    case 1:
      return "red";
    case 2:
      return "blue";
    case 3:
      return "green";
    case 4:
      return "yellow";
    default:
      return "black";
  }
};

export default class Player {
  currency = INITIAL_CURRENCY;
  units = [];
  buildings = [];
  hq = null;

  static create(nth) {
    return new Player(getColor(nth), nth);
  }

  constructor(color, nth) {
    this.color = color;
    this.nth = nth;
  }
}
