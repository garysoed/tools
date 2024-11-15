import {assert, setup, should, test} from 'gs-testing';

import {DirectionalGraph} from '../collect/structures/directional-graph';
import {
  makeNodeId,
  ReadonlyDirectionalGraph,
} from '../collect/structures/readonly-directional-graph';

import {aleaRandom} from './alea-random';
import {randomDfsCluster} from './random-dfs-cluster';

test('@tools/src/random/random-dfs-cluster', () => {
  const node00 = makeNodeId('00');
  const node01 = makeNodeId('01');
  const node10 = makeNodeId('10');
  const node11 = makeNodeId('11');

  const _ = setup(() => {
    const seed = aleaRandom();
    const graph = new DirectionalGraph();
    graph
      .addEdge({from: node00, to: node10})
      .addEdge({from: node00, to: node11})
      .addEdge({from: node00, to: node01})
      .addEdge({from: node10, to: node11})
      .addEdge({from: node01, to: node11});
    return {graph: graph satisfies ReadonlyDirectionalGraph, seed};
  });

  should('randomly generate a cluster', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00, nodeCount: 3},
      _.seed,
    ).run(12);

    assert(new Set(result)).to.equal(new Set([node00, node10, node11]));
  });

  should('return the starting position if size is 1', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00, nodeCount: 1},
      _.seed,
    ).run(12);
    assert(result).to.equal([node00]);
  });

  should('return all the nodes if the target size is too big', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00, nodeCount: 6},
      _.seed,
    ).run(12);
    assert(new Set(result)).to.equal(new Set([node00, node10, node11, node01]));
  });

  should('return all the nodes if size is not given', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00},
      _.seed,
    ).run(12);
    assert(new Set(result)).to.equal(new Set([node00, node10, node11, node01]));
  });
});
