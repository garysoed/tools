import { CACHE_ANNOTATIONS, Caches } from '../data/caches';
import { Errors } from '../error';
import { hash } from '../util/hash';



export function cache(): MethodDecorator {
  return function(
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
    const value = descriptor.value;
    if (!(value instanceof Function)) {
      throw Errors.assert('attached').shouldBeAnInstanceOf(Function).butWas(value);
    }

    descriptor.value = function(...args: any[]): any {
      const cache = Caches.getCache(this, propertyKey);
      const argsHash = args
          .map((arg: any) => {
            return hash(arg);
          })
          .join('_');
      const cachedValue = cache.get(argsHash);
      if (cachedValue !== undefined) {
        return cachedValue;
      }

      const result = value.apply(this, args);
      Caches.setCacheValue(this, propertyKey, argsHash, result);
      return result;
    };

    CACHE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, {});

    return descriptor;
  };
}
