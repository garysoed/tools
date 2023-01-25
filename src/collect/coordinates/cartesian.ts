import {CoordinateSystem} from './coordinate-system';
import {vector, Vector, Vector2} from './vector';
import {zero} from './zero';

export const cartesian: CoordinateSystem = {axes, directions, zero};

function axes(dimension: 2): readonly Vector2[];
function axes(dimension: number): readonly Vector[];
function axes(dimension: number): readonly Vector[] {
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

function directions(dimension: 2): readonly Vector2[];
function directions(dimension: number): readonly Vector[];
function directions(dimension: number): readonly Vector[] {
  const bases = axes(dimension);
  const vectors: Vector[] = [];
  for (const base of bases) {
    vectors.push(base, vector.multiply(base, -1));
  }
  return vectors;
}