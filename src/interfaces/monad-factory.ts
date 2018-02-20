import { Monad } from '../interfaces/monad';

export interface MonadFactory<T> {
  (instance: any): Monad<T>;
}
