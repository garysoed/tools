import { exec } from '../collect/exec';
import { getKey } from '../collect/operators/get-key';
import { head } from '../collect/operators/head';
import { Errors } from '../error';
import { hash } from '../util/hash';
import { CACHE_ANNOTATOR, getCache, setCacheValue } from './caches';

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
      const cachedValue = exec(cacheData, getKey(argsHash), head());
      if (cachedValue !== undefined) {
        return cachedValue[1];
      }

      const result = value.apply(instance, args);
      setCacheValue(instance, propertyKey, argsHash, result);

      return result;
    };

    CACHE_ANNOTATOR.decorator()(target, propertyKey);

    return descriptor;
  };
}
