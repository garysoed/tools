export interface TypedGenerator<T, K> {
  (): IterableIterator<T>;
  isFinite?: boolean;
  getKey?(value: T): K;
}

// Make the types different.
// export interface KeyedGenerator<K, T> extends TypedGenerator<T> {
//   getKey(item: T): K;
// }

// export type FiniteGenerator<T> = TypedGenerator<T> & IsFinite;
// export type FiniteKeyedGenerator<K, T> = KeyedGenerator<K, T> & IsFinite;

// interface IsFinite {
//   isFinite: true;
// }
