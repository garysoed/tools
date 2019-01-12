import { TypedGenerator } from './typed-generator';

export interface KeyedGenerator<K, E> extends TypedGenerator<E> {
  getKey(item: E): K;

  set(generator: TypedGenerator<E>): KeyedGenerator<K, E>;
}
