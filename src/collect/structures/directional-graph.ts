import {
  Edge,
  NodeId,
  ReadonlyDirectionalGraph,
} from './readonly-directional-graph';

export class DirectionalGraph implements ReadonlyDirectionalGraph {
  private readonly _edges: Edge[] = [...this.edgesInput];

  constructor(private readonly edgesInput: Iterable<Edge> = []) {}

  [Symbol.iterator](): Iterator<Edge, any, undefined> {
    return [...this._edges][Symbol.iterator]();
  }

  addEdge(edge: Edge): this {
    this._edges.push(edge);
    return this;
  }

  getAdjacentNodes(from: NodeId): readonly NodeId[] {
    const nodes = new Set<NodeId>();
    for (const edge of this.edges) {
      if (from !== edge.from) {
        continue;
      }

      nodes.add(edge.to);
    }

    return [...nodes];
  }

  get edges(): readonly Edge[] {
    return this._edges;
  }

  get nodes(): readonly NodeId[] {
    const nodes = new Set<NodeId>();
    for (const edge of this.edges) {
      nodes.add(edge.from);
      nodes.add(edge.to);
    }
    return [...nodes];
  }
}
