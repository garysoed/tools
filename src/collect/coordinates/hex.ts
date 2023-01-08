import {cartesian} from './cartesian';
import {CoordinateSystem} from './coordinate-system';
import {vector, Vector, Vector2} from './vector';

export const hex: CoordinateSystem = {directions};

function directions(dimension: 2): readonly Vector2[];
function directions(dimension: number): readonly Vector[];
function directions(dimension: number): readonly Vector[] {
  const bases = cartesian.directions(dimension);
  const vectors = [...bases];
  for (let i = 0; i < bases.length; i++) {
    const a = bases[i];
    for (let j = i + 1; j < bases.length; j++) {
      vectors.push(vector.add(a, bases[j]));
    }
  }
  return vectors;
}