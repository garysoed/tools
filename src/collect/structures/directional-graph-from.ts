import {cartesian} from '../coordinates/cartesian';
import {vector} from '../coordinates/vector';

import {DirectionalGraph} from './directional-graph';
import {Grid, toPositionStr} from './grid';
import {
  makeNodeId,
  ReadonlyDirectionalGraph,
} from './readonly-directional-graph';
import {GridEntry} from './readonly-grid';

export function directionalGraphFrom<T>(
  grid: Grid<T>,
): ReadonlyDirectionalGraph<GridEntry<T>> {
  const graph = new DirectionalGraph<GridEntry<T>>();
  for (const entry of grid) {
    for (const direction of cartesian.directions(2)) {
      const newPosition = vector.add(entry.position, direction);
      const newValue = grid.get(newPosition);
      if (newValue === undefined) {
        continue;
      }

      const from = makeNodeId(toPositionStr(entry.position));
      const to = makeNodeId(toPositionStr(newPosition));
      graph
        .addNode(from, entry)
        .addNode(to, {position: newPosition, value: newValue})
        .addEdge({from, to});
    }
  }

  return graph;
}
