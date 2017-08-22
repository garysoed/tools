import { StaticId } from '../graph/static-id';
import { ImmutableList } from '../immutable';

export type ParameterId = StaticId<any>;

export abstract class GNode<T> {
  constructor(private readonly parameterIds_: ImmutableList<ParameterId>) { }

  abstract execute(params: Iterable<any>): T;

  getParameterIds(): ImmutableList<ParameterId> {
    return this.parameterIds_;
  }
}
