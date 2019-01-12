import { TypedGenerator } from './operators/typed-generator';

export function countable(): TypedGenerator<number> {
  return function *(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  };
}

export function generatorFrom<T>(iterable: Iterable<T>): TypedGenerator<T> {
  return function *(): IterableIterator<T> {
    for (const item of iterable) {
      yield item;
    }
  };
}
