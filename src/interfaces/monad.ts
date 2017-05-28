export interface Monad<T> {
  get(): T;
  set(value: T): void;
}
