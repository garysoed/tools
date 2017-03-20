import { Maps } from '../collection/maps';


/**
 * @hidden
 */
const __cache = Symbol('cache');

/**
 * @hidden
 */
const __cacheMap = Symbol('cacheMap');

/**
 * A cache object.
 *
 * Every object with a cache will have one instance of this object for every cache group.
 */
class Cache {
  private data_: Map<string, any>;
  private obj_: any;

  /**
   * @param obj The obj to cache the data for.
   */
  constructor(obj: any) {
    this.data_ = new Map<string, any>();
    this.obj_ = obj;
  }

  /**
   * Gets the value for the given method.
   *
   * If there is a value cached, it returns that value. Otherwise, it will execute the given
   * delegate function, caches the return value, and returns that value.
   *
   * @param <T> The type of the return value of the function.
   * @param methodName Name of method to get the value of.
   * @param delegate Function to execute if the value is not cached.
   * @return The return value of the delegate if the data is not cached, or the cached value.
   */
  getValue<T>(methodName: string, delegate: () => T): T {
    if (!this.data_.has(methodName)) {
      this.data_.set(methodName, delegate());
    }
    return this.data_.get(methodName);
  }

  /**
   * Clears all cached values stored.
   */
  clearAll(): void {
    this.data_.clear();
  }

  /**
   * Returns the cache corresponding to the given cache group in the given object, if any.
   *
   * If there are no cache objects created, this will create a new cache object.
   *
   * @param obj The object to return the cache object of.
   * @param key The name of the cache group that corresponds to the cache object to return.
   * @return The associated cache object.
   */
  static get(obj: any, key?: string): Cache {
    if (obj[__cache] === undefined) {
      obj[__cache] = new Cache(obj);
    }

    if (obj[__cacheMap] === undefined) {
      obj[__cacheMap] = new Map<string, Cache>();
    }

    if (key !== undefined && !obj[__cacheMap].has(key)) {
      obj[__cacheMap].set(key, new Cache(obj));
    }
    return (key === undefined) ? obj[__cache] : obj[__cacheMap].get(key);
  }
}

/**
 * Interface for the annotation.
 *
 * See [[ACache]] for more documentation.
 */
interface ICacheFunc {
  /**
   * Annotates a getter or function with no arguments to cache their results.
   *
   * @param key Cache group to associate this cache with.
   */
  (key?: string): MethodDecorator;

  /**
   * Clears all cached values in the given object that correspond to the given cache group name.
   *
   * @param obj Object whose cached values should be cleared.
   * @param key Cache group name whose associated caches should be cleared.
   */
  clear(obj: any, key?: string): void;
}

/**
 * Annotates getters and functions with zero arguments to cache its result.
 *
 * To use this, just annotate the method whose return value you'd like to cache. You can clear the
 * cache by calling the [[clear]] method.
 *
 * Example use case:
 *
 * ```typescript
 * import Cache from './a-cache';
 *
 * let i = 0;
 *
 * class TestClass {
 *   @Cache()
 *   get now(): number {
 *     i++;
 *     return i;
 *   }
 * }
 *
 * let testClass = new TestClass();
 * testClass.now();  // 1
 * testClass.now();  // 1
 *
 * // Clear the cache.
 * Cache.clear(testClass);
 * testClass.now();  // 2
 * ```
 *
 * You can also assign key identifiers to each cache call. This lets you to selectively clear a
 * group of cache values. For example:
 *
 * ```typescript
 * import Cache from './a-cache';
 *
 * let i = 0;
 * let j = 0;
 *
 * class TestClass {
 *   @Cache('i')
 *   get i(): number {
 *     i++;
 *     return i;
 *   }
 *
 *   @Cache('j')
 *   get j(): number {
 *     j++;
 *     return j;
 *   }
 * }
 *
 * let testClass = new TestClass();
 * testClass.i;  // 1
 * testClass.j;  // 1
 *
 * // Clear the cache just for i.
 * Cache.clear(testClass, 'i');
 * testClass.i;  // 2
 * testClass.j;  // 1
 * ```
 *
 * @param key Cache group to associate the cache with.
 */
const ACache: ICacheFunc = <any> function(key?: string): MethodDecorator {
  return (
      target: Object,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    if (descriptor.get) {
      const original = descriptor.get;
      descriptor.get = function(...args: any[]): any {
        return Cache.get(this, key).getValue(propertyKey, original.bind(this));
      };
    } else if (descriptor.value) {
      const original = descriptor.value;
      descriptor.value = function(...args: any[]): any {
        return Cache.get(this, key).getValue(propertyKey, original.bind(this));
      };
    } else {
      throw Error(`Property ${propertyKey} has to be a getter or a function`);
    }

    return descriptor;
  };
};

/**
 * Clears all cached values in the given object that correspond to the given cache group name.
 *
 * @param obj Object whose cached values should be cleared.
 * @param key Cache group name whose associated caches should be cleared.
 */
ACache.clear = function(obj: any, key?: string): void {
  Cache.get(obj, key).clearAll();

  if (key === undefined) {
    if (obj[__cacheMap] !== undefined) {
      Maps
          .of<string, Cache>(obj[__cacheMap])
          .forEach((value: Cache, key: string) => {
            value.clearAll();
          });
    }
  }
};

export default ACache;
