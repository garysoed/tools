import { GeneratorOperator } from '../types/operator';

/**
 * Declares the stream to be a finite.
 */
export function declareFinite<T, K>(): GeneratorOperator<T, K, T, K> {
  return from => Object.assign(from, {isFinite: true});
}
