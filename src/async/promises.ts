import { RetryStrategy } from '../async/retry-strategy';
import { ImmutableMap, ImmutableSet, TreeMap } from '../immutable';
import { FiniteCollection } from '../interfaces';

/**
 * Similar to Promise.all, except for any FiniteCollections.
 *
 * @param collection Collection of promises.
 * @return Promise that will be resolved when all elements in the given collection have been
 *     resolved.
 */
export async function forFiniteCollection<T>(collection: FiniteCollection<Promise<T>>):
    Promise<FiniteCollection<T>> {
  return Promise
      .all([...collection])
      .then((values: T[]) => {
        return ImmutableSet.of(values);
      });
}

/**
 * Similar to Promise.all, except for TreeMaps.
 *
 * @param tree Tree of promises.
 * @return Promise that will be resolved when all elements of the given tree have been resolved.
 */
export async function forTreeMap<K, V>(tree: TreeMap<K, Promise<V>>): Promise<TreeMap<K, V>> {
  const promises: Promise<[TreeMap<K, Promise<V>>, V]>[] = [];
  for (const node of tree.postOrder()) {
    promises.push(Promise.all([node, node.getValue()]));
  }

  const results = await Promise.all(promises);
  const resultsMap = ImmutableMap.of(results);

  return tree.map((node, key) => [key, resultsMap.get(node)]);
}

/**
 * Calls the given callback with the given retry strategy.
 *
 * @param callback Function to call and be retried.
 * @param retryStrategy Strategy to retry the given function when rejected.
 * @return Function that will be resolved with the result of the callback, or rejected if after
 *     retries, it is still rejected.
 */
export async function withRetry<T>(
    callback: () => Promise<T>, retryStrategy: RetryStrategy): Promise<T> {
  try {
    return await callback();
  } catch (e) {
    const newStrategy = await retryStrategy.onReject(e);
    if (!newStrategy) {
      throw e;
    }

    return withRetry(callback, newStrategy);
  }
}
