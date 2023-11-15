import {CoordinateSystem} from '../collect/coordinates/coordinate-system';
import {Vector2, vector} from '../collect/coordinates/vector';
import {Grid} from '../collect/structures/grid';
import {ReadonlyGrid} from '../collect/structures/readonly-grid';

import {Random, asRandom, combineRandom} from './random';
import {randomPickInt} from './random-pick-int';
import {randomPickItem} from './random-pick-item';
import {shuffle} from './shuffle';

interface Range {
  readonly min: number;
  readonly max: number;
}

interface ClusterConfig {
  readonly candidates: ReadonlyGrid<unknown>;
  readonly size: Range;
  readonly coordinate: CoordinateSystem;
}

export function randomBfsCluster(
    config: ClusterConfig, random: Random<number>): Random<readonly Vector2[]> {
  const clusterSeedRandom = randomPickItem([...config.candidates], random);
  const clusterSizeRandom = randomPickInt(config.size.min, config.size.max, random);
  return combineRandom(clusterSeedRandom, clusterSizeRandom).take(([clusterSeed, clusterSize]) => {
    if (!clusterSeed) {
      return asRandom([]);
    }
    return growCluster(config, clusterSize, [clusterSeed.position], random);
  });
}


function growCluster(
    spec: ClusterConfig,
    clusterSize: number,
    existingCluster: readonly Vector2[],
    random: Random<number>,
): Random<readonly Vector2[]> {
  if (clusterSize <= 0) {
    return asRandom(existingCluster);
  }

  const lastCluster = existingCluster[existingCluster.length - 1];
  const existingGrid = new Grid(existingCluster.map((position) => ({position, value: true})));
  const candidates = spec.coordinate.directions(2)
      .map(direction => vector.add(lastCluster, direction))
      // Filter out invalid candidates and candidatest that have been picked.
      .filter((position) => spec.candidates.has(position) && !existingGrid.has(position));

  return randomPickItem(candidates, random)
      .take(newTile => {
        if (!newTile) {
          // There are no valid candidates
          return asRandom(existingCluster);
        }

        return shuffle([...existingCluster, newTile], random);
      })
      .take(newExistingCluster => growCluster(
          spec,
          clusterSize - 1,
          newExistingCluster,
          random,
      ));
}