import { GeneratorOperator } from '../types/operator';

export function declareKeyed<T, K>(getKey: (entry: T) => K): GeneratorOperator<T, K, T, K> {
  return from => Object.assign(from, {getKey});
}
