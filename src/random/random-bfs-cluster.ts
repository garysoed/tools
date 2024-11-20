import {DirectionalGraph} from '../collect/structures/directional-graph';
import {
  Edge,
  NodeId,
  ReadonlyDirectionalGraph,
} from '../collect/structures/readonly-directional-graph';

import {Random, asRandom} from './random';
import {randomPickItem} from './random-pick-item';

interface Config<T> {
  readonly graph: ReadonlyDirectionalGraph<T>;
  readonly startNode: NodeId;
  readonly nodeCount?: number | null;
}

interface InternalConfig<T> {
  readonly graph: ReadonlyDirectionalGraph<T>;
  readonly nodeCount: number;
}

export function randomBfsCluster<T>(
  config: Config<T>,
  random: Random<number>,
): Random<ReadonlyDirectionalGraph<T>> {
  const nodeCount = config.nodeCount ?? Number.POSITIVE_INFINITY;
  const startingGraph = new DirectionalGraph<T>();
  const existingValue = config.graph.nodes.get(config.startNode);
  if (existingValue === undefined) {
    throw new Error(`starting node: ${config.startNode} doesn't exist`);
  }
  startingGraph.addNode(config.startNode, existingValue);
  return growCluster({...config, nodeCount}, startingGraph, random);
}

function growCluster<T>(
  config: InternalConfig<T>,
  existingGraph: ReadonlyDirectionalGraph<T>,
  random: Random<number>,
): Random<ReadonlyDirectionalGraph<T>> {
  if (existingGraph.nodes.size >= config.nodeCount) {
    return asRandom(existingGraph);
  }

  const existingSet = new Set<NodeId>(existingGraph.nodes.keys());
  const candidatesSet = new Set<Edge>();
  for (const existingNode of existingGraph.nodes.keys()) {
    for (const newEdge of config.graph.getOutboundEdges(existingNode)) {
      if (existingSet.has(newEdge.to)) {
        continue;
      }

      candidatesSet.add(newEdge);
    }
  }

  // No more candidates left
  if (candidatesSet.size <= 0) {
    return asRandom(existingGraph);
  }

  return randomPickItem([...candidatesSet], random)
    .take((newEdge) => {
      if (!newEdge) {
        // There are no valid candidates
        return asRandom(existingGraph);
      }

      const grid = new DirectionalGraph(existingGraph);
      const newNode = newEdge.to;
      const newValue = config.graph.nodes.get(newNode);
      if (newValue === undefined) {
        throw new Error(`Cannot find node ${newNode}`);
      }
      grid.addNode(newNode, newValue).addEdge(newEdge);

      return asRandom(grid);
    })
    .take((newExistingCluster) => {
      return growCluster(config, newExistingCluster, random);
    });
}
