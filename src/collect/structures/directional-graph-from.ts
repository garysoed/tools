import {cartesian} from '../coordinates/cartesian';
import {vector, Vector2} from '../coordinates/vector';

import {DirectionalGraph} from './directional-graph';
import {Grid, toPositionStr} from './grid';
import {
  makeNodeId,
  NodeId,
  ReadonlyDirectionalGraph,
} from './readonly-directional-graph';

interface GraphAndNodeMap {
  readonly graph: ReadonlyDirectionalGraph;
  readonly nodeMap: ReadonlyMap<NodeId, Vector2>;

  getNodeId(vector: Vector2): NodeId;
}

export function directionalGraphFrom(grid: Grid<unknown>): GraphAndNodeMap {
  const graph = new DirectionalGraph();
  const nodeMap = new Map<NodeId, Vector2>();
  const vectorMap = new Map<Vector2, NodeId>();
  for (const {position} of grid) {
    for (const direction of cartesian.directions(2)) {
      const newPosition = vector.add(position, direction);
      if (!grid.has(newPosition)) {
        continue;
      }

      const from = makeNodeId(toPositionStr(position));
      const to = makeNodeId(toPositionStr(newPosition));
      nodeMap.set(from, position);
      nodeMap.set(to, newPosition);
      vectorMap.set(position, from);
      vectorMap.set(newPosition, to);
      graph.addEdge({from, to});
    }
  }

  return {
    graph,
    nodeMap,
    getNodeId(from: Vector2): NodeId {
      return makeNodeId(toPositionStr(from));
    },
  };
}
