export type Vector = readonly number[];
export type Vector2 = readonly [number, number];

export const vector = {
  add<V extends Vector>(vector1: V, vector2: V): V {
    return vector1.map((value, index) => value + (vector2[index] ?? 0)) as unknown as V;
  },

  multiply<V extends Vector>(vector: V, scalar: number): V {
    return vector.map(value => value * scalar) as unknown as V;
  },
};
