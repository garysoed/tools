import { KeyedGenerator } from './operators/keyed-generator';
import { TypedGenerator } from './operators/typed-generator';

export function countable(): TypedGenerator<number> {
  return function *(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  };
}

export function generatorFrom<K, V>(map: Map<K, V>): KeyedGenerator<K, [K, V]>;
export function generatorFrom<T>(iterable: Iterable<T>): TypedGenerator<T>;
export function generatorFrom(iterable: Iterable<any>): TypedGenerator<any> {
  if (iterable instanceof Map) {
    return generatorFromMap(iterable);
  } else {
    return generatorFromIterable(iterable);
  }
}

function generatorFromMap<K, V>(map: Map<K, V>): KeyedGenerator<K, [K, V]> {
  return upgradeToKeyed(generatorFromIterable(map));
}

function generatorFromIterable<T>(iterable: Iterable<T>): TypedGenerator<T> {
  return function *(): IterableIterator<any> {
    for (const item of iterable) {
      yield item;
    }
  };
}

function upgradeToKeyed<K, V>(
    generator: TypedGenerator<[K, V]>,
): KeyedGenerator<K, [K, V]> {
  return Object.assign(
      generator,
      {
        getKey(item: [K, V]): K {
          return item[0];
        },
        set(generator: TypedGenerator<[K, V]>): KeyedGenerator<K, [K, V]> {
          return upgradeToKeyed(generator);
        },
      },
  );
}


