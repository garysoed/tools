/* eslint-disable @typescript-eslint/ban-types */
import {PropertyAnnotator} from './property-annotation';

const __CACHES = Symbol('caches');

export const CACHE_ANNOTATOR = new PropertyAnnotator(() => undefined);

/**
 * @param target Object to clear the cache from.
 * @param propertyKey Key of the property whose cache should be cleared.
 */
export function clear(instance: Object, propertyKey: string | symbol): void {
  getCaches_(instance).delete(propertyKey);
}

/**
 * Clears all cache in the given object.
 * @param target Object to clear all the cache from.
 */
export function clearAll(instance: Object): void {
  const keysSet = CACHE_ANNOTATOR.data.getAttachedValuesForCtor(instance.constructor).keys();
  for (const key of keysSet) {
    clear(instance, key);
  }
}

/**
 * @param target Object to get the cache of.
 * @param propertyKey Key of the property whose cache should be retrieved.
 */
export function getCache(instance: Object, propertyKey: string|symbol): unknown {
  return getCaches_(instance).get(propertyKey);
}

function getCaches_(target: any): Map<string|symbol, unknown> {
  if (target[__CACHES] !== undefined) {
    return target[__CACHES];
  } else {
    const caches = new Map<string|symbol, unknown>();
    target[__CACHES] = caches;

    return caches;
  }
}

export function setCacheValue(
    instance: Object,
    propertyKey: string | symbol,
    value: unknown): void {
  getCaches_(instance).set(propertyKey, value);
}
