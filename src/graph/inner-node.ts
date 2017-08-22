import { GNode, ParameterId } from '../graph/g-node';
import { ProviderFn } from '../graph/provider';
import { ImmutableList } from '../immutable';

export class InnerNode<T> extends GNode<T> {
  constructor(
      private readonly context_: any,
      private readonly fn_: ProviderFn<T>,
      parameterIds_: ImmutableList<ParameterId>) {
    super(parameterIds_);
  }

  execute(params: Iterable<any>): T {
    return this.fn_.apply(this.context_, [...params]);
  }
}
