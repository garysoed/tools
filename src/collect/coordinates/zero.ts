import {Vector, Vector2} from './vector';

export function zero(dimension: 2): Vector2;
export function zero(dimension: number): Vector;
export function zero(dimension: number): Vector {
  const vector: number[] = [];
  for (let i = 0; i < dimension; i++) {
    vector.push(0);
  }
  return vector;
}
