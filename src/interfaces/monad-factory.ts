import { Monad } from '../interfaces/monad';

export type MonadFactory<T> = (instance: Object) => Monad<T>;
