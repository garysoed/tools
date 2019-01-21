export interface TypedGenerator<T, K> {
  (): IterableIterator<T>;
  isFinite?: boolean;
  getKey?(value: T): K;
}
