import { CACHE_ANNOTATIONS, Caches } from '../data/caches';
import { hash } from '../util/hash';



export function cache(): MethodDecorator {
  return function(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
    const value = descriptor.value;
    if (value === undefined) {
      throw new Error(`Property ${propertyKey} must be a method`);
    }

    descriptor.value = function(...args: any[]): any {
      const cache = Caches.getCache(this, propertyKey);
      const argsHash = args
          .map((arg: any) => {
            return hash(arg);
          })
          .join('_');
      if (cache.has(argsHash)) {
        return cache.get(argsHash);
      }

      const result = value.apply(this, args);
      cache.set(argsHash, result);
      return result;
    };

    CACHE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, {});

    return descriptor;
  };
}
