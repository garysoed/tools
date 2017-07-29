import { MonadValue } from '../interfaces/monad-value';

export interface MonadSetter<T> {
  readonly value: T;

  set(newValue: T): MonadValue<T>;
}
