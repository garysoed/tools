import {makeTypeFactory, Nominal} from '../../typescript/nominal';

export type NodeId = Nominal<string, 'NodeId'>;
export const makeNodeId = makeTypeFactory<NodeId>();

export interface Edge {
  readonly from: NodeId;
  readonly to: NodeId;
}

export interface ReadonlyDirectionalGraph extends Iterable<Edge> {
  readonly nodes: readonly NodeId[];
  readonly edges: readonly Edge[];

  getAdjacentNodes(from: NodeId): readonly NodeId[];
}
