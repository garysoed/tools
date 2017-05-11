import { Annotations } from '../data/annotations';
import { ImmutableMap } from '../immutable/immutable-map';

const __CACHES = Symbol('caches');

export const CACHE_ANNOTATIONS = Annotations.of(__CACHES);


export class Caches {
  /**
   * @param target Object to clear the cache from.
   * @param propertyKey Key of the property whose cache should be cleared.
   */
  static clear(instance: Object, propertyKey: string | symbol): void {
    Caches.getCache_(instance, propertyKey).clear();
  }

  /**
   * Clears all cache in the given object.
   * @param target Object to clear all the cache from.
   */
  static clearAll(instance: Object): void {
    for (const key of CACHE_ANNOTATIONS.forCtor(instance.constructor).getAnnotatedProperties()) {
      Caches.clear(instance, key);
    }
  }

  /**
   * @param target Object to get the cache of.
   * @param propertyKey Key of the property whose cache should be retrieved.
   */
  static getCache(instance: Object, propertyKey: string | symbol): ImmutableMap<string, any> {
    return ImmutableMap.of(Caches.getCache_(instance, propertyKey));
  }

  private static getCache_(instance: Object, propertyKey: string | symbol): Map<string, any> {
    const caches = Caches.getCaches(instance);
    const value = caches.get(propertyKey);
    if (value !== undefined) {
      return value;
    }

    const cache = new Map<string, any>();
    caches.set(propertyKey, cache);
    return cache;
  }

  private static getCaches(target: Object): Map<string | symbol, Map<string, any>> {
    if (target[__CACHES] !== undefined) {
      return target[__CACHES];
    } else {
      const caches = new Map<string | symbol, Map<string, any>>();
      target[__CACHES] = caches;
      return caches;
    }
  }

  static setCacheValue(
      instance: Object,
      propertyKey: string | symbol,
      key: string,
      value: any): void {
    Caches.getCache_(instance, propertyKey).set(key, value);
  }
}
