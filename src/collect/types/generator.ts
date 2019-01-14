export type TypedGenerator<T> = () => IterableIterator<T>;

export interface KeyedGenerator<K, T> extends TypedGenerator<T> {
  getKey(item: T): K;
}

export type FiniteGenerator<T> = TypedGenerator<T> & IsFinite;
export type FiniteKeyedGenerator<K, T> = KeyedGenerator<K, T> & IsFinite;

interface IsFinite {
  isFinite: true;
}
