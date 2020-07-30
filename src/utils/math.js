const random = (min, max) => min + (max - min) * Math.random();
const between = (min, max) => (x) => Math.max(min, Math.min(x, max));
const signed = (x) => (x > 0 ? `+${x}` : `${x}`);

const EPSILON = 0.000001;

export { between, signed, random, EPSILON };
