import { MonadValue } from './monad-value';

export interface MonadSetter<T> {
  readonly value: T;

  set(newValue: T): MonadValue<T>;
}
