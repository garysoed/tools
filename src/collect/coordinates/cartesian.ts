import {CoordinateSystem} from './coordinate-system';
import {Vector, Vector2} from './vector';

export const cartesian: CoordinateSystem = {directions};

function directions(dimension: 2): readonly Vector2[];
function directions(dimension: number): readonly Vector[];
function directions(dimension: number): readonly Vector[] {
  const vectors: Vector[] = [];
  for (let d = 0; d < dimension; d++) {
    const unit: number[] = [];
    for (let i = 0; i < dimension; i++) {
      unit.push(i === d ? 1 : 0);
    }
    vectors.push(unit);
  }
  return vectors;
}