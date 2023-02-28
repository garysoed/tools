import {matrix} from './matrix';

export type Vector = readonly number[];
export type Vector2 = readonly [number, number];

export const vector = {
  add<V extends Vector>(vector1: V, vector2: V): V {
    return vector1.map((value, index) => value + (vector2[index] ?? 0)) as unknown as V;
  },

  intersect(
      vector1Point: Vector2,
      vector1Dir: Vector2,
      vector2Point: Vector2,
      vector2Dir: Vector2,
  ): Vector2|null {
    const m = [[vector1Dir[0], -vector2Dir[0]], [vector1Dir[1], -vector2Dir[1]]] as const;
    const inverse = matrix.inverse(m);
    if (!inverse) {
      return null;
    }

    const diff = vector.add(vector2Point, vector.multiply(vector1Point, -1));

    const multiplier = [
      inverse[0][0] * diff[0] + inverse[0][1] * diff[1],
      inverse[1][0] * diff[0] + inverse[1][1] * diff[1],
    ];

    return vector.add(vector1Point, vector.multiply(vector1Dir, multiplier[0]));
  },

  length(vector: Vector): number {
    return Math.hypot(...vector);
  },

  multiply<V extends Vector>(vector: V, scalar: number): V {
    return vector.map(value => value * scalar) as unknown as V;
  },

  scaleToLength<V extends Vector>(v: V, targetLength: number): V {
    const currLength = vector.length(v);
    return vector.multiply(v, targetLength / currLength);
  },
};