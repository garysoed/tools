import {Vector, Vector2} from './vector';

export interface CoordinateSystem {
  directions(dimension: 2): readonly Vector2[];
  directions(dimension: number): readonly Vector[];
}
