import { GeneratorOperator } from '../types/operator';

export function declareFinite<T, K>(): GeneratorOperator<T, K, T, K> {
  return from => Object.assign(from, {isFinite: true});
}
