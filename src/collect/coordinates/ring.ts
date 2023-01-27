import {CoordinateSystem} from './coordinate-system';
import {vector, Vector, Vector2} from './vector';

export type Rings<V extends Vector> = ReadonlyMap<number, ReadonlySet<V>>;

export function ring(dimension: 2, coordinateSystem: CoordinateSystem, distance: number): Rings<Vector2>;
export function ring(dimension: number, coordinateSystem: CoordinateSystem, distance: number): Rings<Vector>;
export function ring(dimension: number, coordinateSystem: CoordinateSystem, distance: number): Rings<Vector> {
  return ringHelper(
      coordinateSystem.zero(dimension),
      distance,
      coordinateSystem.directions(dimension),
  ).rings;
}

interface Result {
  readonly cumulative: ReadonlyMap<string, number>;
  readonly rings: Rings<Vector>;
}
function ringHelper(
    zero: Vector,
    targetDistance: number,
    directions: readonly Vector[],
): Result {
  if (targetDistance <= 0) {
    return {
      cumulative: new Map([[serializeVector(zero), 0]]),
      rings: new Map([[0, new Set([zero])]]),
    };
  }

  const result = ringHelper(zero, targetDistance - 1, directions);
  const cumulativeRings = new Map(result.cumulative);
  const rings = new Set<Vector>();
  const seeds = result.rings.get(targetDistance - 1) ?? [];
  for (const seed of seeds) {
    for (const direction of directions) {
      const candidate = vector.add(seed, direction);
      const serializedCandidate = serializeVector(candidate);
      if (cumulativeRings.has(serializedCandidate)) {
        continue;
      }

      cumulativeRings.set(serializedCandidate, targetDistance);
      rings.add(candidate);
    }
  }

  return {
    cumulative: cumulativeRings,
    rings: new Map([
      ...result.rings,
      [targetDistance, rings],
    ]),
  };
}

function serializeVector(vector: Vector): string {
  return vector.join(',');
}