import {Vector, Vector2} from './vector';

export interface CoordinateSystem {
  axes(dimension: 2): readonly Vector2[];
  axes(dimension: number): readonly Vector[];

  directions(dimension: 2): readonly Vector2[];
  directions(dimension: number): readonly Vector[];
}
