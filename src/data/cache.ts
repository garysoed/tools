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
    const {get, value} = descriptor;
    if (value instanceof Function) {
      descriptor.value = createCachedFunctionCall(value, propertyKey);
    } else if (get instanceof Function) {
      descriptor.get = createCachedFunctionCall(get, propertyKey);
    } else {
      throw Errors.assert('attached function').shouldBe('a method or getter').butNot();
    }

    CACHE_ANNOTATOR.decorator()(target, propertyKey);

    return descriptor;
  };
}

function createCachedFunctionCall(
    origFn: Function,
    propertyKey: string|symbol,
): (...args: unknown[]) => unknown {
  return function(this: any, ...args: any[]): any {
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

    const result = origFn.apply(instance, args);
    setCacheValue(instance, propertyKey, argsHash, result);

    return result;
  };
}
