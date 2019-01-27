import { pipe } from '../collect/pipe';
import { keys } from '../collect/operators/keys';
import { createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';
import { asImmutableSet } from '../collect/types/immutable-set';
import { PropertyAnnotator } from './property-annotation';

const __CACHES = Symbol('caches');

export const CACHE_ANNOTATOR = new PropertyAnnotator(() => undefined);

/**
 * @param target Object to clear the cache from.
 * @param propertyKey Key of the property whose cache should be cleared.
 */
export function clear(instance: Object, propertyKey: string | symbol): void {
  getCache_(instance, propertyKey).clear();
}

/**
 * Clears all cache in the given object.
 * @param target Object to clear all the cache from.
 */
export function clearAll(instance: Object): void {
  const keysSet = pipe(
      CACHE_ANNOTATOR.data.getAttachedValuesForCtor(instance.constructor),
      keys(),
      asImmutableSet(),
  );
  for (const key of keysSet) {
    clear(instance, key);
  }
}

/**
 * @param target Object to get the cache of.
 * @param propertyKey Key of the property whose cache should be retrieved.
 */
export function getCache(instance: Object, propertyKey: string | symbol):
    ImmutableMap<string, any> {
  return createImmutableMap(getCache_(instance, propertyKey));
}

function getCache_(instance: Object, propertyKey: string | symbol): Map<string, any> {
  const caches = getCaches_(instance);
  const value = caches.get(propertyKey);
  if (value !== undefined) {
    return value;
  }

  const cache = new Map<string, any>();
  caches.set(propertyKey, cache);

  return cache;
}

function getCaches_(target: any): Map<string | symbol, Map<string, any>> {
  if (target[__CACHES] !== undefined) {
    return target[__CACHES];
  } else {
    const caches = new Map<string | symbol, Map<string, any>>();
    target[__CACHES] = caches;

    return caches;
  }
}

export function setCacheValue(
    instance: Object,
    propertyKey: string | symbol,
    key: string,
    value: any): void {
  getCache_(instance, propertyKey).set(key, value);
}
