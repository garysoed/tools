import { copyMetadata } from './generators';
import { TypedGenerator } from './types/generator';
import { GeneratorOperator } from './types/operator';

export function createGeneratorOperator<T1, K1, T2, K2>(
    createFn: (from: TypedGenerator<T1, K1>) => TypedGenerator<T2, K2>,
): GeneratorOperator<T1, K1, T2, K2> {
  return from => copyMetadata(createFn(from), from);
}
