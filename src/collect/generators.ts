import { FiniteGenerator, KeyedGenerator, TypedGenerator } from './types/generator';

export function countable(): TypedGenerator<number> {
  return function *(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  };
}

export function copyMetadata<K, V>(
    base: TypedGenerator<V>,
    source: KeyedGenerator<K, any>,
): KeyedGenerator<K, V>;
export function copyMetadata<T>(
    base: TypedGenerator<T>,
    source: FiniteGenerator<any>,
): FiniteGenerator<T>;
export function copyMetadata<T>(base: TypedGenerator<T>, source: TypedGenerator<any>):
    TypedGenerator<T>;
export function copyMetadata(base: TypedGenerator<any>, source: TypedGenerator<any>): any {
  if (isFinite(source)) {
    return upgradeToFinite(base);
  } else if (isKeyed(source)) {
    return upgradeToKeyed(base, entry => source.getKey(entry));
  } else {
    return base;
  }
}

export function generatorFrom<T>(array: T[]): FiniteGenerator<T>;
export function generatorFrom<K, V>(map: Map<K, V>): KeyedGenerator<K, [K, V]>;
export function generatorFrom<T>(iterable: Iterable<T>): TypedGenerator<T>;
export function generatorFrom(iterable: Iterable<any>): TypedGenerator<any> {
  if (iterable instanceof Array) {
    return generatorFromArray(iterable);
  } else if (iterable instanceof Map) {
    return generatorFromMap(iterable);
  } else {
    return generatorFromIterable(iterable);
  }
}

function generatorFromArray<T>(array: T[]): FiniteGenerator<T> {
  return upgradeToFinite(generatorFromIterable(array));
}

function generatorFromMap<K, V>(map: Map<K, V>): KeyedGenerator<K, [K, V]> {
  return upgradeToFinite(
      upgradeToKeyed(generatorFromIterable(map), ([key]) => key),
  );
}

function generatorFromIterable<T>(iterable: Iterable<T>): TypedGenerator<T> {
  return function *(): IterableIterator<any> {
    for (const item of iterable) {
      yield item;
    }
  };
}

function upgradeToFinite<O extends TypedGenerator<T>, T>(generator: O): O & {isFinite: true} {
  return Object.assign(generator, {isFinite: true as true});
}

function upgradeToKeyed<K, V>(
    generator: TypedGenerator<V>,
    getKey: (value: V) => K,
): KeyedGenerator<K, V> {
  return Object.assign(
      generator,
      {
        getKey(item: V): K {
          return getKey(item);
        },
      },
  );
}

function isFinite(from: TypedGenerator<any>): from is FiniteGenerator<any> {
  return (from as any).isFinite;
}

function isKeyed(from: TypedGenerator<any>): from is KeyedGenerator<any, any> {
  return typeof (from as any).set === 'function';
}

