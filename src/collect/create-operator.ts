import { Stream } from './types/stream';
import { GeneratorOperator } from './types/operator';

export function createGeneratorOperatorCopyAll<T, K, T2 extends T>(
    createFn: (from: Stream<T, K>) => Stream<T2, K>,
): GeneratorOperator<T, K, T2, K> {
  return from => Object.assign(createFn(from), from);
}

export function createGeneratorOperatorCopySize<T1, K1, T2, K2>(
    createFn: (from: Stream<T1, K1>) => Stream<T2, K2>,
): GeneratorOperator<T1, K1, T2, K2> {
  return from => Object.assign(createFn(from), {isFinite: from.isFinite});
}
