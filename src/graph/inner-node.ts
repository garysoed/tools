import { GNode, ParameterId } from '../graph/g-node';
import { Provider } from '../graph/provider';
import { ImmutableList } from '../immutable';

export class InnerNode<T> extends GNode<T> {
  constructor(
      private readonly fn_: Provider<T>,
      parameterIds_: ImmutableList<ParameterId>) {
    super(parameterIds_);
  }

  execute_(context: {}, params: Iterable<any>): T {
    return this.fn_.apply(context, [...params]);
  }
}
