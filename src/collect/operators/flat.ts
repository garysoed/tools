import { GeneratorOperator } from '../types/operator';

export function flat<T>(): GeneratorOperator<Iterable<T>, any, T, any> {
  return from => function *(): IterableIterator<T> {
    for (const iterable of from()) {
      yield* iterable;
    }
  };
}
