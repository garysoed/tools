import { createGeneratorOperatorCopyAll } from '../create-operator';
import { pipe } from '../pipe';
import { countable } from '../generators';
import { GeneratorOperator } from '../types/operator';
import { map } from './map';
import { takeWhile } from './take-while';
import { zip } from './zip';

export function take<T, K>(count: number): GeneratorOperator<T, K, T, K> {
  return createGeneratorOperatorCopyAll(from => {
    const gen = pipe(
        from,
        zip(countable()),
        takeWhile(([_, index]) => index < count),
        map(([value]) => value),
    );

    return Object.assign(gen, {isFinite: true as true});
  });
}
