import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { GeneratorOperator } from '../types/operator';
import { filter } from './filter';

export function filterPick<T1, T2, K, R extends T1>(
    index: 0,
    filterFn: (value: T1) => value is R,
): GeneratorOperator<[T1, T2], K, [R, T2], K>;
export function filterPick<T1, T2, K, R extends T2>(
    index: 1,
    filterFn: (value: T2) => value is R,
): GeneratorOperator<[T1, T2], K, [T1, R], K>;
export function filterPick<T, K, N extends keyof T & number>(
    index: N,
    filterFn: (value: T[N]) => boolean,
): GeneratorOperator<T, K, T, K>;
export function filterPick<T, K, N extends keyof T & number>(
  index: N,
  filterFn: (value: T[N]) => boolean,
): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => exec(
      from,
      filter(item => filterFn(item[index])),
  ));
}
