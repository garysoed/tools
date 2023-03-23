type Getter<This, Value> = (this: This) => Value;

type CacheDecorator =
    <This extends {}, Value>(
      target: Getter<This, Value>,
      context: ClassGetterDecoratorContext<This, Value>,
    ) => Getter<This, Value>;

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
export function cache(): CacheDecorator {
  return <This extends {}, Value>(
    target: Getter<This, Value>,
    context: ClassGetterDecoratorContext<This, Value>,
  ): Getter<This, Value> => {
    return function(this: This): Value {
      const cacheState = getCache(this, context.name);
      if (cacheState.isSet) {
        return cacheState.value as Value;
      }

      const value = target.call(this);
      setCacheValue(this, context.name, value);
      return value;
    };
  };
}


interface CacheStateSet {
  readonly isSet: true;
  readonly value: unknown;
}

interface CacheStateUnset {
  readonly isSet: false;
}

type CacheState = CacheStateSet|CacheStateUnset;

const __CACHES = Symbol('caches');
interface MaybeHasCache {
  [__CACHES]?: Map<string|symbol, unknown>;
}


function getCache(instance: MaybeHasCache, propertyKey: string|symbol): CacheState {
  const map = getCacheMap(instance);
  if (!map.has(propertyKey)) {
    return {isSet: false};
  }

  return {isSet: true, value: map.get(propertyKey)};
}

function getCacheMap(target: MaybeHasCache): Map<string|symbol, unknown> {
  if (target[__CACHES] !== undefined) {
    return target[__CACHES];
  } else {
    const caches = new Map<string|symbol, unknown>();
    target[__CACHES] = caches;

    return caches;
  }
}

function setCacheValue(
    instance: MaybeHasCache,
    propertyKey: string | symbol,
    value: unknown): void {
  getCacheMap(instance).set(propertyKey, value);
}
