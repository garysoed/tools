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
  bases.forEach((a, i) => {
    for (let j = i + 1; j < bases.length; j++) {
      const base = bases[j];
      if (base === undefined) {
        continue;
      }
      vectors.push(vector.add(a, base));
    }
  });
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
