import {assert, setup, should, test} from 'gs-testing';

import {DirectionalGraph} from '../collect/structures/directional-graph';
import {makeNodeId} from '../collect/structures/readonly-directional-graph';

import {aleaRandom} from './alea-random';
import {randomDfsCluster} from './random-dfs-cluster';

test('@tools/src/random/random-dfs-cluster', () => {
  const node00 = makeNodeId('00');
  const node01 = makeNodeId('01');
  const node10 = makeNodeId('10');
  const node11 = makeNodeId('11');

  const _ = setup(() => {
    const seed = aleaRandom();
    const graph = new DirectionalGraph<string>();
    graph
      .addNode(node00, '00')
      .addNode(node01, '01')
      .addNode(node10, '10')
      .addNode(node11, '11')
      .addEdge({from: node00, to: node10})
      .addEdge({from: node00, to: node11})
      .addEdge({from: node00, to: node01})
      .addEdge({from: node11, to: node10})
      .addEdge({from: node01, to: node11});
    return {graph, seed};
  });

  should('randomly generate a cluster', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00, nodeCount: 3},
      _.seed,
    ).run(12);

    assert(result.nodes).to.equal(
      new Map([
        [node00, '00'],
        [node11, '11'],
        [node10, '10'],
      ]),
    );
    assert(new Set(result.edges)).to.equal(
      new Set([
        {from: node00, to: node11},
        {from: node11, to: node10},
      ]),
    );
  });

  should('return the starting position if size is 1', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00, nodeCount: 1},
      _.seed,
    ).run(12);
    assert(result.nodes).to.equal(new Map([[node00, '00']]));
    assert(result.edges.length).to.equal(0);
  });

  should('return all the nodes if the target size is too big', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00, nodeCount: 6},
      _.seed,
    ).run(12);
    assert(result.nodes).to.equal(
      new Map([
        [node00, '00'],
        [node10, '10'],
        [node11, '11'],
        [node01, '01'],
      ]),
    );
    assert(new Set(result.edges)).to.equal(
      new Set([
        {from: node00, to: node11},
        {from: node11, to: node10},
        {from: node00, to: node01},
      ]),
    );
  });

  should('return all the nodes if size is not given', () => {
    const result = randomDfsCluster(
      {graph: _.graph, startNode: node00},
      _.seed,
    ).run(12);
    assert(result.nodes).to.equal(
      new Map([
        [node00, '00'],
        [node10, '10'],
        [node11, '11'],
        [node01, '01'],
      ]),
    );
    assert(new Set(result.edges)).to.equal(
      new Set([
        {from: node00, to: node11},
        {from: node11, to: node10},
        {from: node00, to: node01},
      ]),
    );
  });
});
