import { copyMetadata } from '../generators';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { MappedTypeOperator } from '../types/operator';

export function zip<T, B0>(
    g0: TypedGenerator<B0>,
): MappedTypeOperator<T, [T, B0]>;
export function zip<T, B0, B1>(
    g0: TypedGenerator<B0>,
    g1: TypedGenerator<B1>,
): MappedTypeOperator<T, [T, B0, B1]>;
export function zip<T, B0, B1, B2>(
    g0: TypedGenerator<B0>,
    g1: TypedGenerator<B1>,
    g2: TypedGenerator<B2>,
): MappedTypeOperator<T, [T, B0, B1, B2]>;
export function zip<T>(...generators: Array<TypedGenerator<any>>): MappedTypeOperator<T, any[]> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, any[]>;
  function operator<K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, any[]>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<any[]>;
  function operator(from: TypedGenerator<T>): TypedGenerator<any[]>;
  function operator(from: TypedGenerator<T>): TypedGenerator<any[]> {
    return copyMetadata(
        function *(): IterableIterator<any[]> {
          const iterables = generators.map(generator => generator());
          for (const valueA of from()) {
            const result = [valueA];
            for (const iterable of iterables) {
              const {value, done} = iterable.next();
              if (done) {
                return;
              }

              result.push(value);
            }

            yield result;
          }
        },
        from,
    );
  }

  return operator;
}
