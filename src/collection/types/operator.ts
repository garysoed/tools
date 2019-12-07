import { Stream } from './stream';

export type UnknownTypeGeneratorOperator =
    <T1, K1, T2, K2>(from: Stream<T1, K1>) => Stream<T2, K2>;
export type GeneratorOperator<T1, K1, T2, K2> =
    (from: Stream<T1, K1>) => Stream<T2, K2>;
