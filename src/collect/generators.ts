import { Stream } from './types/stream';

export function countable(): Stream<number, any> {
  return function *(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  };
}

export function generatorFrom<K, V>(map: Map<K, V>): Stream<[K, V], K>;
export function generatorFrom<T>(iterable: Iterable<T>|T[]): Stream<T, void>;
export function generatorFrom(iterable: Iterable<any>): Stream<any, any> {
  if (iterable instanceof Array) {
    return generatorFromArray(iterable);
  } else if (iterable instanceof Map) {
    return generatorFromMap(iterable);
  } else {
    return generatorFromIterable(iterable);
  }
}

function generatorFromArray<T>(array: T[]): Stream<T, void> {
  return upgradeToFinite(generatorFromIterable(array));
}

function generatorFromMap<K, V>(map: Map<K, V>): Stream<[K, V], K> {
  return upgradeToFinite(
      upgradeToKeyed(generatorFromIterable(map), ([key]) => key),
  );
}

function generatorFromIterable<T>(iterable: Iterable<T>): Stream<T, void> {
  return function *(): IterableIterator<any> {
    for (const item of iterable) {
      yield item;
    }
  };
}

export function getKey<T, K>(generator: Stream<T, K>, value: T): K {
  if (!isKeyed(generator)) {
    throw new Error('generator requires a getKey function');
  }

  return generator.getKey(value);
}

export function toArray<T, K>(generator: Stream<T, K>): T[] {
  if (generator.isFinite !== true) {
    throw new Error('generator requires to be finite');
  }

  return [...generator()];
}

function upgradeToFinite<T, K>(generator: Stream<T, K>): Stream<T, K> {
  return Object.assign(generator, {isFinite: true});
}

export function upgradeToKeyed<K, V>(
    generator: Stream<V, any>,
    getKey: (value: V) => K,
): Stream<V, K> {
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
    from: Stream<T, K>,
): from is Stream<T, K> & {getKey(value: T): K} {
  return from.getKey instanceof Function;
}

