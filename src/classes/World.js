import * as _ from "utils";

const RANDOMNESS = 2.5;
const distort = (i) => _.random(-0.5, 0.5) / Math.pow(RANDOMNESS, i);

const subdivide = (prev, i) => {
  const xScaled = prev.map((prev) => {
    const next = [prev[0]];
    prev.slice(1).forEach((height) => {
      next.push((next[next.length - 1] + height) / 2 + distort(i));
      next.push(height);
    });
    return next;
  });

  const scaled = [xScaled[0]];
  xScaled.slice(1).forEach((nextRow) => {
    const prevRow = scaled[scaled.length - 1];
    const inbetweenRow = [];
    for (let x = 0; x < prevRow.length; x++) {
      inbetweenRow[x] = (prevRow[x] + nextRow[x]) / 2 + distort(i);
    }
    scaled.push(inbetweenRow);
    scaled.push(nextRow);
  });

  return scaled;
};

const discretize = (levels, heightMap) => {
  const values = heightMap.flatMap((row) => row);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return heightMap.map((row) =>
    row.map((cell) =>
      Math.floor((levels * (cell - min)) / (_.EPSILON + max - min))
    )
  );
};

export default class World {
  static create(subdivisions) {
    const heightMap = discretize(
      2,
      _.repeat(subdivide, subdivisions, [
        [_.random(-0.5, 0.25), _.random(0, 0.75), _.random(-0.5, 0.25)],
        [_.random(0, 0.75), _.random(0.75, 1.5), _.random(0, 0.75)],
        [_.random(-0.5, 0.25), _.random(0, 0.75), _.random(-0.5, 0.25)],
      ])
    );
    return new World(heightMap);
  }

  constructor(heightMap) {
    this.heightMap = heightMap;
  }

  getWidth() {
    return this.heightMap[0].length;
  }

  getHeight() {
    return this.heightMap.length;
  }

  at(x, y) {
    try {
      return this.heightMap[y][x];
    } catch {
      return 0;
    }
  }

  values() {
    return this.heightMap.flatMap((row, y) =>
      row.map((height, x) => ({ x, y, height }))
    );
  }
}
