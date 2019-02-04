import { GeneratorOperator } from '../types/operator';
import { Stream } from '../types/stream';

export function flat<T>(): GeneratorOperator<Iterable<T>, any, T, any> {
  return from => function *(): IterableIterator<T> {
    for (const stream of from()) {
      yield* stream;
    }
  };
}
