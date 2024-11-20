import {assert, should, test} from 'gs-testing';

import {DirectionalGraph} from './directional-graph';
import {makeNodeId} from './readonly-directional-graph';

test('@tools/src/collect/structures/directional-graph', () => {
  test('nodes', () => {
    should('return all the nodes in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph<string>();
      graph
        .addNode(nodeA, 'A')
        .addNode(nodeB, 'B')
        .addNode(nodeC, 'C')
        .addEdge({from: nodeA, to: nodeB})
        .addEdge({from: nodeB, to: nodeC});

      assert(graph.nodes).to.haveExactElements(
        new Map([
          [nodeA, 'A'],
          [nodeB, 'B'],
          [nodeC, 'C'],
        ]),
      );
    });
  });

  test('edges', () => {
    should('return all the edges in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph<string>();
      graph
        .addNode(nodeA, 'A')
        .addNode(nodeB, 'B')
        .addNode(nodeC, 'C')
        .addEdge({from: nodeA, to: nodeB})
        .addEdge({from: nodeB, to: nodeC});

      assert(new Set(graph.edges)).to.haveExactElements(
        new Set([
          {from: nodeA, to: nodeB},
          {from: nodeB, to: nodeC},
        ]),
      );
    });
  });

  test('getOutboundEdges', () => {
    should('return all the outgoing edges in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph<string>();
      graph
        .addNode(nodeA, 'A')
        .addNode(nodeB, 'B')
        .addNode(nodeC, 'C')
        .addEdge({from: nodeB, to: nodeA})
        .addEdge({from: nodeB, to: nodeC});

      assert(new Set(graph.getOutboundEdges(nodeB))).to.haveExactElements(
        new Set([
          {from: nodeB, to: nodeA},
          {from: nodeB, to: nodeC},
        ]),
      );
    });
  });

  test('getInboundEdges', () => {
    should('return all the incoming edges in the graph', () => {
      const nodeA = makeNodeId('a');
      const nodeB = makeNodeId('b');
      const nodeC = makeNodeId('c');
      const graph = new DirectionalGraph<string>();
      graph
        .addNode(nodeA, 'A')
        .addNode(nodeB, 'B')
        .addNode(nodeC, 'C')
        .addEdge({from: nodeC, to: nodeA})
        .addEdge({from: nodeB, to: nodeA})
        .addEdge({from: nodeB, to: nodeC});

      assert(new Set(graph.getInboundEdges(nodeA))).to.haveExactElements(
        new Set([
          {from: nodeB, to: nodeA},
          {from: nodeC, to: nodeA},
        ]),
      );
    });
  });
});
