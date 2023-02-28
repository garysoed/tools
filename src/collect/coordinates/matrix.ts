import {vector, Vector2} from './vector';

export type Matrix = ReadonlyArray<readonly number[]>;

export type SquareMatrix2 = readonly [Vector2, Vector2];

export const matrix = {
  determinant(m: SquareMatrix2): number {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  },

  inverse(m: SquareMatrix2): SquareMatrix2|null {
    const determinant = matrix.determinant(m);
    if (determinant === 0) {
      return null;
    }

    return matrix.multiply([[m[1][1], -m[0][1]], [-m[1][0], m[0][0]]] as const, 1 / determinant);
  },

  multiply<M extends Matrix>(m: M, scalar: number): M {
    const result = m.map(v => vector.multiply(v, scalar)) as unknown as M;
    return result;
  },
};