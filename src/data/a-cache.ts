import Maps from '../collection/maps';


const __cache = Symbol('cache');
const __cacheMap = Symbol('cacheMap');

class Cache {
  private data_: Map<string, any>;
  private obj_: any;

  constructor(obj: any) {
    this.data_ = new Map<string, any>();
    this.obj_ = obj;
  }

  getValue(methodName: string, delegate: Function): any {
    if (!this.data_.has(methodName)) {
      this.data_.set(methodName, delegate());
    }
    return this.data_.get(methodName);
  }

  clearAll(): void {
    this.data_.clear();
  }

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

interface ICacheFunc {
  (key?: string): MethodDecorator;
  clear: (obj: any, key?: string) => void;
}

/**
 * Annotates getters to cache the return value.
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
 * Clears all cache in the given object.
 */
ACache.clear = function(obj: any, key?: string): void {
  Cache.get(obj, key).clearAll();

  if (key === undefined) {
    if (obj[__cacheMap] !== undefined) {
      Maps
          .of(obj[__cacheMap])
          .forEach((key: string, value: Cache) => {
            value.clearAll();
          });
    }
  }
};

export default ACache;
