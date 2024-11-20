import {assert, should, test} from 'gs-testing';

import {directionalGraphFrom} from './directional-graph-from';
import {Grid} from './grid';

test('@tools/src/collect/structures/directional-graph-from', () => {
  should('create the correct graph and node map from grid', () => {
    const grid = new Grid<string>();
    grid.set([0, 0], '00');
    grid.set([1, 0], '10');
    grid.set([0, 1], '01');
    grid.set([1, 1], '11');

    const graph = directionalGraphFrom(grid);
    const edgesInGridEntries = [...graph.edges].map(({from, to}) => ({
      from: graph.nodes.get(from)!,
      to: graph.nodes.get(to)!,
    }));
    assert(new Set([...edgesInGridEntries])).to.equal(
      new Set([
        {
          from: {position: [0, 0], value: '00'},
          to: {position: [1, 0], value: '10'},
        },
        {
          from: {position: [0, 0], value: '00'},
          to: {position: [0, 1], value: '01'},
        },
        {
          from: {position: [1, 0], value: '10'},
          to: {position: [0, 0], value: '00'},
        },
        {
          from: {position: [1, 0], value: '10'},
          to: {position: [1, 1], value: '11'},
        },
        {
          from: {position: [0, 1], value: '01'},
          to: {position: [0, 0], value: '00'},
        },
        {
          from: {position: [0, 1], value: '01'},
          to: {position: [1, 1], value: '11'},
        },
        {
          from: {position: [1, 1], value: '11'},
          to: {position: [0, 1], value: '01'},
        },
        {
          from: {position: [1, 1], value: '11'},
          to: {position: [1, 0], value: '10'},
        },
      ]),
    );
  });
});
