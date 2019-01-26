export interface Stream<T, K> {
  (): IterableIterator<T>;
  isFinite?: boolean;
  getKey?(value: T): K;
}
