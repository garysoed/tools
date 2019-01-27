import { createGeneratorOperatorCopySize } from '../create-operator';
import { pipe } from '../pipe';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';

type Mapped<T, N extends keyof T & number, R> = {[K in keyof T]: K extends N ? R : T[K]};

export function mapPick<T1, T2, K, R>(
    index: 1,
    mapFn: (from: T2) => R,
): GeneratorOperator<[T1, T2], K, [T1, R], K>;
export function mapPick<T extends any[], K, N extends keyof T & number, R>(
    index: N,
    mapFn: (from: T[N]) => R,
): GeneratorOperator<T, K, Mapped<T, N, R>, K> {
  return createGeneratorOperatorCopySize(from => pipe(
      from,
      map(item => {
        const rv = [...item];
        rv.splice(index, 1, mapFn(item[index]));

        return rv as any;
      }),
  ));
}
