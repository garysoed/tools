import { GNode } from '../graph/g-node';
import { NodeId } from '../graph/node-id';
import { Provider } from '../graph/provider';
import { ImmutableList, Iterables } from '../immutable';

type Cache<T> = {context: {} | null, params: any[], value: T};

export class InnerNode<T> extends GNode<T> {
  private cache_: Cache<T> | null = null;

  constructor(
      private readonly fn_: Provider<T>,
      parameterIds_: ImmutableList<NodeId<any>>) {
    super(parameterIds_);
  }

  execute_(context: {}, params: Iterable<any>): T {
    if (this.isCached(context, params)) {
      if (!this.cache_) {
        throw new Error('isCached returns true but there are no caches');
      }

      return this.cache_.value;
    }

    const cache = {
      context,
      params: [...params],
      value: this.fn_.apply(context, [...params]),
    };
    this.cache_ = cache;
    return cache.value;
  }

  isCached(context: {} | null, params: Iterable<any>): boolean {
    if (!this.cache_) {
      return false;
    }

    if (this.cache_.context !== context) {
      return false;
    }

    return Iterables.unsafeEquals(this.cache_.params, params);
  }
}
