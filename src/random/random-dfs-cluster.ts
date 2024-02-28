import {Vector2, vector} from '../collect/coordinates/vector';
import {Grid} from '../collect/structures/grid';
import {ReadonlyGrid} from '../collect/structures/readonly-grid';

import {ClusterConfig} from './cluster-config';
import {Random, asRandom} from './random';
import {randomPickInt} from './random-pick-int';
import {randomPickItem} from './random-pick-item';
import {shuffle} from './shuffle';

export function randomDfsCluster(
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

  const lastCluster = existingCluster[existingCluster.length - 1];
  const existingGrid = new Grid(
    existingCluster.map((position) => ({position, value: true})),
  );
  const newPositions = [
    ...calculateValidNewPositions(lastCluster, spec, existingGrid),
  ];
  if (newPositions.length <= 0) {
    for (const existingPosition of existingCluster) {
      newPositions.push(
        ...calculateValidNewPositions(existingPosition, spec, existingGrid),
      );
    }
  }

  const candidatesGrid = new Grid<{}>();
  for (const newPosition of newPositions) {
    candidatesGrid.set(newPosition, {});
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

function calculateValidNewPositions(
  fromPosition: Vector2,
  spec: ClusterConfig,
  existingGrid: ReadonlyGrid<{}>,
): readonly Vector2[] {
  const positions = [];
  for (const direction of spec.coordinate.directions(2)) {
    const newPosition = vector.add(fromPosition, direction);
    if (!spec.candidates.has(newPosition)) {
      continue;
    }

    if (existingGrid.has(newPosition)) {
      continue;
    }

    positions.push(newPosition);
  }

  return positions;
}
