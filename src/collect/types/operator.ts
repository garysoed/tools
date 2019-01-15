import { TypedGenerator } from './generator';

export type UnknownTypeGeneratorOperator =
    <T1, K1, T2, K2>(from: TypedGenerator<T1, K1>) => TypedGenerator<T2, K2>;
export type GeneratorOperator<T1, K1, T2, K2> =
    (from: TypedGenerator<T1, K1>) => TypedGenerator<T2, K2>;
