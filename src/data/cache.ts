import { Errors } from '../error';
import { hash } from '../util/hash';
import { CACHE_ANNOTATIONS, getCache, setCacheValue } from './caches';

/**
 * Caches the given method.
 */
export function cache(): MethodDecorator {
  return (
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const value = descriptor.value;
    if (!(value instanceof Function)) {
      throw Errors.assert('attached').shouldBeAnInstanceOf(Function).butWas(value);
    }

    descriptor.value = function(...args: any[]): any {
      // tslint:disable-next-line:no-invalid-this no-this-assignment
      const instance = this;
      const cacheData = getCache(instance, propertyKey);
      const argsHash = args
          .map((arg: any) => {
            return hash(arg);
          })
          .join('_');
      const cachedValue = cacheData.get(argsHash);
      if (cachedValue !== undefined) {
        return cachedValue;
      }

      const result = value.apply(instance, args);
      setCacheValue(instance, propertyKey, argsHash, result);

      return result;
    };

    CACHE_ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(propertyKey, {});

    return descriptor;
  };
}
