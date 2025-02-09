import {makeTypeFactory, Nominal} from '../../typescript/nominal';

export type NodeId = Nominal<string, 'NodeId'>;
export const makeNodeId = makeTypeFactory<NodeId>();

export interface Edge {
  readonly from: NodeId;
  readonly to: NodeId;
}

export interface ReadonlyDirectionalGraph<T> {
  readonly edges: readonly Edge[];
  readonly nodes: ReadonlyMap<NodeId, T>;

  getInboundEdges(from: NodeId): readonly Edge[];
  getOutboundEdges(to: NodeId): readonly Edge[];
}
