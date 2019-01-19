import { createGeneratorOperatorCopySize } from '../create-operator';
import { exec } from '../exec';
import { getKey } from '../generators';
import { TypedGenerator } from '../types/generator';
import { map } from './map';

export function keys<T, K>(): (from: TypedGenerator<T, K>) => TypedGenerator<K, void> {
  return createGeneratorOperatorCopySize(from => exec(from, map(entry => getKey(from, entry))));
}
