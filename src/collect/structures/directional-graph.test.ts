import {assert, should, test} from 'gs-testing';

import {DirectionalGraph} from './directional-graph';
import {makeNodeId} from './readonly-directional-graph';

test('@tools/src/collect/structures/directional-graph', () => {
  test('nodes', () => {
    should('return all the nodes in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph();
      graph.addEdge({from: nodeA, to: nodeB}).addEdge({from: nodeB, to: nodeC});

      assert(new Set(graph.nodes)).to.haveExactElements(
        new Set([nodeA, nodeB, nodeC]),
      );
    });
  });

  test('edges', () => {
    should('return all the edges in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph();
      graph.addEdge({from: nodeA, to: nodeB}).addEdge({from: nodeB, to: nodeC});

      assert(new Set(graph.edges)).to.haveExactElements(
        new Set([
          {from: nodeA, to: nodeB},
          {from: nodeB, to: nodeC},
        ]),
      );
    });
  });

  test('getAdjacentNodes', () => {
    should('return all the adjacent nodes in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph();
      graph.addEdge({from: nodeB, to: nodeA}).addEdge({from: nodeB, to: nodeC});

      assert(new Set(graph.getAdjacentNodes(nodeB))).to.haveExactElements(
        new Set([nodeA, nodeC]),
      );
    });
  });
});
