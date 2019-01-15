import { createGeneratorOperator } from '../create-operator';
import { assertKeyedGenerator } from '../generators';
import { transform } from '../transform';
import { TypedGenerator } from '../types/generator';
import { map } from './map';

export function keys<T, K>(): (from: TypedGenerator<T, K>) => TypedGenerator<K, void> {
  return createGeneratorOperator(from => {
    const fromGen = assertKeyedGenerator(from);

    return transform(
        from,
        map(entry => fromGen.getKey(entry)),
    );
  });
}
