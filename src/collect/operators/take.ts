import { createGeneratorOperatorCopyAll } from '../create-operator';
import { exec } from '../exec';
import { countable } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function take<T, K>(count: number): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const gen = exec(
        from,
        zip(countable()),
        takeWhile(([_, index]) => index < count),
        map(([value]) => value),
    );

    return Object.assign(gen, {isFinite: true as true});
  });
}
