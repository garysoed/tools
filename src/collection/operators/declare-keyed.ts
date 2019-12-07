import { GeneratorOperator } from '../types/operator';

/**
 * Declares the Stream as keyed.
 * @param getKey Function to get the key from the given entry.
 */
export function declareKeyed<T, K>(getKey: (entry: T) => K): GeneratorOperator<T, any, T, K> {
  return from => Object.assign(from, {getKey});
}
