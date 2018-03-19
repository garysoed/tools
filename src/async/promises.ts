import { RetryStrategy } from '../async/retry-strategy';
import { ImmutableMap, ImmutableSet, TreeMap } from '../immutable';
import { FiniteCollection } from '../interfaces';

export const Promises = {
  forFiniteCollection<T>(collection: FiniteCollection<Promise<T>>): Promise<FiniteCollection<T>> {
    return Promise
        .all([...collection])
        .then((values: T[]) => {
          return ImmutableSet.of(values);
        });
  },

  async forTreeMap<K, V>(tree: TreeMap<K, Promise<V>>): Promise<TreeMap<K, V>> {
    const promises: Promise<[TreeMap<K, Promise<V>>, V]>[] = [];
    for (const node of tree.postOrder()) {
      promises.push(Promise.all([node, node.getValue()]));
    }

    const results = await Promise.all(promises);
    const resultsMap = ImmutableMap.of(results);
    return tree.map((node, key) => [key, resultsMap.get(node)!]);
  },

  async withRetry<T>(callback: () => Promise<T>, retryStrategy: RetryStrategy): Promise<T> {
    try {
      return await callback();
    } catch (e) {
      const newStrategy = await retryStrategy.onReject(e);
      if (!newStrategy) {
        throw e;
      }

      return Promises.withRetry(callback, newStrategy);
    }
  },
};
