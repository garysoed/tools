import { NodeId } from '../graph/node-id';
import { ImmutableList } from '../immutable';

export const GLOBALS = {};

export abstract class GNode<T> {
  constructor(private readonly parameterIds_: ImmutableList<NodeId<any>>) { }

  execute(context: {} | null, params: Iterable<any>): T {
    return this.execute_(context || GLOBALS, params);
  }

  protected abstract execute_(context: {}, params: Iterable<any>): T;

  getParameterIds(): ImmutableList<NodeId<any>> {
    return this.parameterIds_;
  }
}
