import {Vector, Vector2} from './vector';

export interface CoordinateSystem {
  axes(dimension: 2): readonly Vector2[];
  axes(dimension: number): readonly Vector[];

  directions(dimension: 2): readonly Vector2[];
  directions(dimension: number): readonly Vector[];

  zero(dimension: 2): Vector2;
  zero(dimension: number): Vector;
}
