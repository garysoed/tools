import { Monad } from './monad';

export interface MonadFactory<T> {
  (instance: any): Monad<T>;
}
