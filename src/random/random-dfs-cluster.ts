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
  readonly nodeCount?: null | number;
  readonly startNode: NodeId;
}

interface InternalConfig<T> {
  readonly graph: ReadonlyDirectionalGraph<T>;
  readonly nodeCount: number;
}

export function randomDfsCluster<T>(
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
  return growCluster<T>({...config, nodeCount}, startingGraph, random);
}

function growCluster<T>(
  config: InternalConfig<T>,
  existingGraph: ReadonlyDirectionalGraph<T>,
  random: Random<number>,
): Random<ReadonlyDirectionalGraph<T>> {
  if (existingGraph.nodes.size >= config.nodeCount) {
    return asRandom(existingGraph);
  }

  const lastNode = [...existingGraph.nodes.keys()][
    existingGraph.nodes.size - 1
  ];
  if (lastNode === undefined) {
    return asRandom(existingGraph);
  }

  const existingSet = new Set(existingGraph.nodes.keys());
  const newEdges = [...calculateValidNewEdges(lastNode, config, existingSet)];

  // Reached a dead end, backtrack
  if (newEdges.length <= 0) {
    for (const existingPosition of existingGraph.nodes.keys()) {
      newEdges.push(
        ...calculateValidNewEdges(existingPosition, config, existingSet),
      );
    }
  }

  if (newEdges.length <= 0) {
    return asRandom(existingGraph);
  }

  return randomPickItem(newEdges, random)
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

function calculateValidNewEdges<T>(
  fromPosition: NodeId,
  spec: InternalConfig<T>,
  existingSet: ReadonlySet<NodeId>,
): readonly Edge[] {
  const positions = [];
  for (const newEdge of spec.graph.getOutboundEdges(fromPosition)) {
    if (existingSet.has(newEdge.to)) {
      continue;
    }

    positions.push(newEdge);
  }

  return positions;
}
