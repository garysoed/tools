import { Annotations } from '../data/annotations';

const __CACHES = Symbol('caches');

export const CACHE_ANNOTATIONS = Annotations.of(__CACHES);


export const Caches = {
  /**
   * @param target Object to clear the cache from.
   * @param propertyKey Key of the property whose cache should be cleared.
   */
  clear(instance: Object, propertyKey: string | symbol): void {
    Caches.getCache(instance, propertyKey).clear();
  },

  /**
   * Clears all cache in the given object.
   * @param target Object to clear all the cache from.
   */
  clearAll(instance: Object): void {
    CACHE_ANNOTATIONS.forCtor(instance.constructor).getAnnotatedProperties()
        .forEach((key: string | symbol) => {
          Caches.clear(instance, key);
        });
  },

  /**
   * @param target Object to get the cache of.
   * @param propertyKey Key of the property whose cache should be retrieved.
   */
  getCache(instance: Object, propertyKey: string | symbol): Map<string, any> {
    const caches = Caches.getCaches(instance);
    if (caches.has(propertyKey)) {
      return caches.get(propertyKey)!;
    }

    const cache = new Map<string, any>();
    caches.set(propertyKey, cache);
    return cache;
  },

  getCaches(target: Object): Map<string | symbol, Map<string, any>> {
    if (target[__CACHES] !== undefined) {
      return target[__CACHES];
    } else {
      const caches = new Map<string | symbol, Map<string, any>>();
      target[__CACHES] = caches;
      return caches;
    }
  },
};
