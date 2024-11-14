import {Vector2, vector} from '../collect/coordinates/vector';
import {Grid} from '../collect/structures/grid';

import {ClusterConfig} from './cluster-config';
import {Random, asRandom} from './random';
import {randomPickInt} from './random-pick-int';
import {randomPickItem} from './random-pick-item';
import {shuffle} from './shuffle';

export function randomBfsCluster(
  startingPosition: Vector2,
  config: ClusterConfig,
  random: Random<number>,
): Random<readonly Vector2[]> {
  const clusterSizeRandom = randomPickInt(
    config.size.min,
    config.size.max,
    random,
  );
  return clusterSizeRandom.take((clusterSize) => {
    return growCluster(config, clusterSize - 1, [startingPosition], random);
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

  const existingGrid = new Grid<{}>(
    existingCluster.map((position) => ({position, value: {}})),
  );
  const candidatesGrid = new Grid<{}>();
  for (const existingPosition of existingCluster) {
    for (const direction of spec.coordinate.directions(2)) {
      const newPosition = vector.add(existingPosition, direction);
      const isNewPositionValid =
        spec.candidates.find((candidate) =>
          vector.equals(candidate, newPosition),
        ) !== null;
      if (!isNewPositionValid) {
        continue;
      }

      if (existingGrid.has(newPosition)) {
        continue;
      }

      candidatesGrid.set(newPosition, {});
    }
  }

  return randomPickItem(
    [...candidatesGrid].map(({position}) => position),
    random,
  )
    .take((newTile) => {
      if (!newTile) {
        // There are no valid candidates
        return asRandom(existingCluster);
      }

      return shuffle([...existingCluster, newTile], random);
    })
    .take((newExistingCluster) => {
      return growCluster(
        spec,
        clusterSize - (newExistingCluster.length - existingCluster.length),
        newExistingCluster,
        random,
      );
    });
}
