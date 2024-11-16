import {assert, should, test} from 'gs-testing';

import {directionalGraphFrom} from './directional-graph-from';
import {Grid} from './grid';

test('@tools/src/collect/structures/directional-graph-from', () => {
  should('create the correct graph and node map from grid', () => {
    const grid = new Grid<{}>();
    grid.set([0, 0], {});
    grid.set([1, 0], {});
    grid.set([0, 1], {});
    grid.set([1, 1], {});

    const {graph, nodeMap, getNodeId} = directionalGraphFrom(grid);
    const edgesInVectors = [...graph].map(({from, to}) => ({
      from: nodeMap.get(from)!,
      to: nodeMap.get(to)!,
    }));
    assert(new Set([...edgesInVectors])).to.equal(
      new Set([
        {from: [0, 0], to: [1, 0]},
        {from: [0, 0], to: [0, 1]},
        {from: [1, 0], to: [0, 0]},
        {from: [1, 0], to: [1, 1]},
        {from: [0, 1], to: [0, 0]},
        {from: [0, 1], to: [1, 1]},
        {from: [1, 1], to: [0, 1]},
        {from: [1, 1], to: [1, 0]},
      ]),
    );
    assert(nodeMap.get(getNodeId([0, 1]))).to.equal([0, 1]);
  });
});
