import { TypedGenerator } from './types/generator';

export function assertKeyedGenerator<T, K>(
    generator: TypedGenerator<T, K>,
): TypedGenerator<T, K> & {getKey(value: T): K} {
  if (!isKeyed(generator)) {
    throw new Error('generator requires a getKey function');
  }

  return generator;
}

export function assertFinite<T, K>(
    generator: TypedGenerator<T, K>,
): TypedGenerator<T, K> & {isFinite: true} {
  if (generator.isFinite !== true) {
    throw new Error('generator requires to be finite');
  }

  return generator as TypedGenerator<T, K> & {isFinite: true};
}

export function countable(): TypedGenerator<number, any> {
  return function *(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  };
}

export function copyMetadata<T, K>(
    base: TypedGenerator<T, K>,
    source: TypedGenerator<any, any>,
): any {
  return Object.assign(base, source);
}

export function generatorFrom<K, V>(map: Map<K, V>): TypedGenerator<[K, V], K>;
export function generatorFrom<T>(iterable: Iterable<T>|T[]): TypedGenerator<T, void>;
export function generatorFrom(iterable: Iterable<any>): TypedGenerator<any, any> {
  if (iterable instanceof Array) {
    return generatorFromArray(iterable);
  } else if (iterable instanceof Map) {
    return generatorFromMap(iterable);
  } else {
    return generatorFromIterable(iterable);
  }
}

function generatorFromArray<T>(array: T[]): TypedGenerator<T, void> {
  return upgradeToFinite(generatorFromIterable(array));
}

function generatorFromMap<K, V>(map: Map<K, V>): TypedGenerator<[K, V], K> {
  return upgradeToFinite(
      upgradeToKeyed(generatorFromIterable(map), ([key]) => key),
  );
}

function generatorFromIterable<T>(iterable: Iterable<T>): TypedGenerator<T, void> {
  return function *(): IterableIterator<any> {
    for (const item of iterable) {
      yield item;
    }
  };
}

function upgradeToFinite<T, K>(generator: TypedGenerator<T, K>): TypedGenerator<T, K> {
  return Object.assign(generator, {isFinite: true});
}

export function upgradeToKeyed<K, V>(
    generator: TypedGenerator<V, any>,
    getKey: (value: V) => K,
): TypedGenerator<V, K> {
  return Object.assign(
      generator,
      {
        getKey(item: V): K {
          return getKey(item);
        },
      },
  );
}

export function isKeyed<T, K>(
    from: TypedGenerator<T, K>,
): from is TypedGenerator<T, K> & {getKey(value: T): K} {
  return from.getKey instanceof Function;
}

