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

export function randomBfsCluster(
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

  const existingSet = new Set<NodeId>(existingCluster);
  const candidatesSet = new Set<NodeId>();
  for (const existingNode of existingCluster) {
    for (const newNode of config.graph.getAdjacentNodes(existingNode)) {
      if (existingSet.has(newNode)) {
        continue;
      }

      candidatesSet.add(newNode);
    }
  }

  // No more candidates left
  if (candidatesSet.size <= 0) {
    return asRandom(existingCluster);
  }

  return randomPickItem([...candidatesSet], random)
    .take((newTile) => {
      if (!newTile) {
        // There are no valid candidates
        return asRandom(existingCluster);
      }

      return shuffle([...existingCluster, newTile], random);
    })
    .take((newExistingCluster) => {
      return growCluster(config, newExistingCluster, random);
    });
}
