import { TypedGenerator } from './types/generator';
import { GeneratorOperator } from './types/operator';

export function createGeneratorOperatorCopyAll<T, K>(
    createFn: (from: TypedGenerator<T, K>) => TypedGenerator<T, K>,
): GeneratorOperator<T, K, T, K> {
  return from => Object.assign(createFn(from), from);
}

export function createGeneratorOperatorCopySize<T1, K1, T2, K2>(
    createFn: (from: TypedGenerator<T1, K1>) => TypedGenerator<T2, K2>,
): GeneratorOperator<T1, K1, T2, K2> {
  return from => Object.assign(createFn(from), {isFinite: from.isFinite});
}
