import {
  Edge,
  NodeId,
  ReadonlyDirectionalGraph,
} from './readonly-directional-graph';

export class DirectionalGraph<T = never>
  implements ReadonlyDirectionalGraph<T>
{
  private readonly _edges: Edge[] = [...(this.initGraph?.edges ?? [])];
  private readonly _nodes = new Map<NodeId, T>(this.initGraph?.nodes ?? []);

  constructor(
    private readonly initGraph: ReadonlyDirectionalGraph<T> | null = null,
  ) {}

  addEdge(edge: Edge): this {
    if (!this._nodes.has(edge.to)) {
      throw new Error(`Node ${edge.to} is missing`);
    }

    if (!this._nodes.has(edge.from)) {
      throw new Error(`Node ${edge.from} is missing`);
    }

    this._edges.push(edge);
    return this;
  }
  addNode(id: NodeId, value: T): this {
    this._nodes.set(id, value);
    return this;
  }
  getInboundEdges(to: NodeId): readonly Edge[] {
    const edges = new Set<Edge>();
    for (const edge of this.edges) {
      if (to !== edge.to) {
        continue;
      }

      edges.add(edge);
    }

    return [...edges];
  }
  getOutboundEdges(from: NodeId): readonly Edge[] {
    const edges = new Set<Edge>();
    for (const edge of this.edges) {
      if (from !== edge.from) {
        continue;
      }

      edges.add(edge);
    }

    return [...edges];
  }

  get edges(): readonly Edge[] {
    return this._edges;
  }
  get nodes(): ReadonlyMap<NodeId, T> {
    return this._nodes;
  }
}
