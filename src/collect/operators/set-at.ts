import { copyMetadata, countable } from '../generators';
import { transform } from '../transform';
import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from '../types/generator';
import { TypedOperator } from '../types/operator';
import { map } from './map';
import { zip } from './zip';

export function setAt<T>(...setSpecs: Array<[number, T]>): TypedOperator<T> {
  function operator<K>(from: FiniteKeyedGenerator<K, T>): FiniteKeyedGenerator<K, T>;
  function operator<K>(from: KeyedGenerator<K, T>): KeyedGenerator<K, T>;
  function operator(from: FiniteGenerator<T>): FiniteGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T>;
  function operator(from: TypedGenerator<T>): TypedGenerator<T> {
    const setSpecMap = new Map(setSpecs);

    return copyMetadata(
        transform(
            from,
            zip(countable()),
            map<[T, number], T>(([value, index]) => {
              if (index === undefined) {
                return value;
              }

              const setValue = setSpecMap.get(index);

              return setValue === undefined ? value : setValue;
            }),
        ),
        from,
    );
  }

  return operator;
}
