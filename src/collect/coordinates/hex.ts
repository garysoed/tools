import {cartesian} from './cartesian';
import {CoordinateSystem} from './coordinate-system';
import {vector, Vector, Vector2} from './vector';
import {zero} from './zero';

export const hex: CoordinateSystem = {axes, directions, zero};

function axes(dimension: 2): readonly Vector2[];
function axes(dimension: number): readonly Vector[];
function axes(dimension: number): readonly Vector[] {
  const bases = cartesian.axes(dimension);
  const vectors = [...bases];
  for (let i = 0; i < bases.length; i++) {
    const a = bases[i];
    for (let j = i + 1; j < bases.length; j++) {
      vectors.push(vector.add(a, bases[j]));
    }
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
