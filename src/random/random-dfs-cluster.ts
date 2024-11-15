import {
  NodeId,
  ReadonlyDirectionalGraph,
} from '../collect/structures/readonly-directional-graph';

import {Random, asRandom} from './random';
import {randomPickItem} from './random-pick-item';
import {shuffle} from './shuffle';

interface Config {
  readonly graph: ReadonlyDirectionalGraph;
  readonly startNode: NodeId;
  readonly nodeCount?: number | null;
}

interface InternalConfig {
  readonly graph: ReadonlyDirectionalGraph;
  readonly nodeCount: number;
}

export function randomDfsCluster(
  config: Config,
  random: Random<number>,
): Random<readonly NodeId[]> {
  const nodeCount = config.nodeCount ?? Number.POSITIVE_INFINITY;
  return growCluster({...config, nodeCount}, [config.startNode], random);
}

function growCluster(
  config: InternalConfig,
  existingCluster: readonly NodeId[],
  random: Random<number>,
): Random<readonly NodeId[]> {
  if (existingCluster.length >= config.nodeCount) {
    return asRandom(existingCluster);
  }

  const lastCluster = existingCluster[existingCluster.length - 1];
  if (lastCluster === undefined) {
    return asRandom(existingCluster);
  }

  const existingSet = new Set(existingCluster);
  const newPositions = [
    ...calculateValidNewPositions(lastCluster, config, existingSet),
  ];

  // Reached a dead end, backtrack
  if (newPositions.length <= 0) {
    for (const existingPosition of existingCluster) {
      newPositions.push(
        ...calculateValidNewPositions(existingPosition, config, existingSet),
      );
    }
  }

  if (newPositions.length <= 0) {
    return asRandom(existingCluster);
  }

  const candidatesSet = new Set<NodeId>();
  for (const newPosition of newPositions) {
    candidatesSet.add(newPosition);
  }

  return randomPickItem([...candidatesSet], random)
    .take((newNode) => {
      if (!newNode) {
        // There are no valid candidates
        return asRandom(existingCluster);
      }

      return shuffle([...existingCluster, newNode], random);
    })
    .take((newExistingCluster) => {
      return growCluster(config, newExistingCluster, random);
    });
}

function calculateValidNewPositions(
  fromPosition: NodeId,
  spec: InternalConfig,
  existingSet: ReadonlySet<NodeId>,
): readonly NodeId[] {
  const positions = [];
  for (const newPosition of spec.graph.getAdjacentNodes(fromPosition)) {
    if (existingSet.has(newPosition)) {
      continue;
    }

    positions.push(newPosition);
  }

  return positions;
}
