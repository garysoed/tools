import { BaseDisposable } from '../dispose';
import { AssertionError } from '../error';
import { GraphTime } from '../graph/graph-time';
import { NodeId } from '../graph/node-id';
import { ImmutableList, ImmutableMap } from '../immutable';

export const GLOBALS = new BaseDisposable();

export abstract class GNode<T> {
  private readonly cacheMap_: Map<{}, Map<GraphTime, T>> = new Map<{}, Map<GraphTime, T>>();

  constructor(private readonly parameterIds_: ImmutableList<NodeId<any>>) { }

  protected addToCache_(context: {}, timestamp: GraphTime, value: T): void {
    const cache = this.getCache_(context);
    if (cache.has(timestamp)) {
      throw AssertionError.condition(`cache`, `not have timestamp ${timestamp}`, cache);
    }
    cache.set(timestamp, value);
  }

  execute(context: {} | null, params: Iterable<any>, timestamp: GraphTime): T {
    const normalizedContext = context || GLOBALS;
    const cachedValue = this.getCache_(normalizedContext).get(timestamp);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = this.execute_(normalizedContext, params);
    this.addToCache_(normalizedContext, timestamp, value);
    return value;
  }

  protected abstract execute_(context: {}, params: Iterable<any>): T;

  getCache_(context: {}): Map<GraphTime, T> {
    const map = this.cacheMap_.get(context);
    if (map) {
      return map;
    }

    const cache = new Map<GraphTime, T>();
    this.cacheMap_.set(context, cache);
    return cache;
  }

  getLatestCacheValue(context: {} | null, timestamp: GraphTime): [GraphTime, T] | null {
    const cache = this.cacheMap_.get(context || GLOBALS);
    if (!cache) {
      return null;
    }

    return ImmutableMap
        .of(cache)
        .filter((_: T, time: GraphTime) => {
          return time.beforeOrEqualTo(timestamp);
        })
        .reduce<[GraphTime, T] | null>(
            (
                prev: [GraphTime, T] | null,
                value: T,
                key: GraphTime) => {
              if (!prev) {
                return [key, value];
              }

              if (prev[0].beforeOrEqualTo(key)) {
                return [key, value];
              } else {
                return prev;
              }
            },
            null);
  }

  getParameterIds(): ImmutableList<NodeId<any>> {
    return this.parameterIds_;
  }
}
