/* eslint-disable @typescript-eslint/ban-types */
import {CACHE_ANNOTATOR, getCache, setCacheValue} from './caches';


/**
 * Caches the given method.
 *
 * @remarks
 * This only calls the implementation once. Subsequent calls to the function will return the first
 * return value without calling the implementation.
 *
 * This only support getters and methods with 0 arguments.
 *
 * @thDecorator accessor method
 * @thModule data
 */
export function cache(): MethodDecorator {
  return (
      target: Object,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const {get, value} = descriptor;
    if (value instanceof Function) {
      if (value.length > 0) {
        throw new Error('attached function should be a method with 0 arguments');
      }
      descriptor.value = createCachedFunctionCall(value, propertyKey);
    } else if (get instanceof Function) {
      descriptor.get = createCachedFunctionCall(get, propertyKey);
    } else {
      throw new Error('attached function should be a method or getter');
    }

    CACHE_ANNOTATOR.decorator()(target, propertyKey);

    return descriptor;
  };
}

function createCachedFunctionCall(
    origFn: Function,
    propertyKey: string|symbol,
): (...args: unknown[]) => unknown {
  return function(this: any): any {
    const cachedValue = getCache(this, propertyKey);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const result = origFn.apply(this);
    setCacheValue(this, propertyKey, result);

    return result;
  };
}
