import { FiniteGenerator, FiniteKeyedGenerator, KeyedGenerator, TypedGenerator } from './generator';

export type Operator<F, T> = (from: F) => T;

export interface UntypedOperator<G = TypedGenerator<any>> {
  <T, K>(from: FiniteKeyedGenerator<K, T> & G): FiniteKeyedGenerator<K, T>;
  <T, K>(from: KeyedGenerator<K, T> & G): KeyedGenerator<K, T>;
  <T>(from: FiniteGenerator<T> & G): FiniteGenerator<T>;
  <T>(from: TypedGenerator<T> & G): TypedGenerator<T>;
}

export interface TypedOperator<T, G = TypedGenerator<any>> {
  <K>(from: FiniteKeyedGenerator<K, T> & G): FiniteKeyedGenerator<K, T>;
  <K>(from: KeyedGenerator<K, T> & G): KeyedGenerator<K, T>;
  (from: FiniteGenerator<T> & G): FiniteGenerator<T>;
  (from: TypedGenerator<T> & G): TypedGenerator<T>;
}

export interface TypedKeyedOperator<T, K, G = TypedGenerator<any>> {
  (from: FiniteKeyedGenerator<K, T> & G): FiniteKeyedGenerator<K, T>;
  (from: KeyedGenerator<K, T> & G): KeyedGenerator<K, T>;
}

export interface MappedTypeOperator<F, T, G = TypedGenerator<any>> {
  <K>(from: FiniteKeyedGenerator<K, F> & G): FiniteKeyedGenerator<K, T>;
  <K>(from: KeyedGenerator<K, F> & G): KeyedGenerator<K, T>;
  (from: FiniteGenerator<F> & G): FiniteGenerator<T>;
  (from: TypedGenerator<F> & G): TypedGenerator<T>;
}
