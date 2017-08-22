import { StaticId } from '../graph/static-id';
import { ImmutableList } from '../immutable';

export type ParameterId = StaticId<any>;
export const GLOBALS = {};

export abstract class GNode<T> {
  constructor(private readonly parameterIds_: ImmutableList<ParameterId>) { }

  execute(context: {} | null, params: Iterable<any>): T {
    return this.execute_(context || GLOBALS, params);
  }

  protected abstract execute_(context: {}, params: Iterable<any>): T;

  getParameterIds(): ImmutableList<ParameterId> {
    return this.parameterIds_;
  }
}
