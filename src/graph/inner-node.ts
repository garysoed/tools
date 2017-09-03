import { GNode } from '../graph/g-node';
import { NodeId } from '../graph/node-id';
import { Provider } from '../graph/provider';
import { ImmutableList } from '../immutable';

export class InnerNode<T> extends GNode<T> {
  constructor(
      private readonly fn_: Provider<T>,
      parameterIds_: ImmutableList<NodeId<any>>) {
    super(parameterIds_);
  }

  execute_(context: {}, params: Iterable<any>): T {
    return this.fn_.apply(context, [...params]);
  }

  getProvider(): Provider<T> {
    return this.fn_;
  }
}
