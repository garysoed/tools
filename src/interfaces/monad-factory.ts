import { Monad } from '../interfaces/monad';

export interface MonadFactory<T>{
  (instance: Object): Monad<T>;
}
