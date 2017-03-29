const __CACHE = Symbol('cache');

export const Caches = {
  /**
   * @param target Object to clear the cache from.
   * @param propertyKey Key of the property whose cache should be cleared.
   */
  clear(target: Object, propertyKey: string | symbol): void {
    Caches.getCache(target, propertyKey).clear();
  },

  /**
   * @param target Object to get the cache of.
   * @param propertyKey Key of the property whose cache should be retrieved.
   */
  getCache(target: Object, propertyKey: string | symbol): Map<string, any> {
    if (target[propertyKey][__CACHE] !== undefined) {
      return target[propertyKey][__CACHE];
    }

    const cache = new Map<string, any>();
    target[propertyKey][__CACHE] = cache;
    return cache;
  },
};
