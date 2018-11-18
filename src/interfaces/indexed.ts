import { Collection } from './collection';
import { FiniteCollection } from './finite-collection';

export interface Indexed<I, T> {
  deleteAllKeys(keys: FiniteCollection<I>): Indexed<I, T>;

  deleteKey(key: I): Indexed<I, T>;

  entries(): Collection<[I, T]> & Iterable<[I, T]>;

  filter(checker: (value: T, index: I) => boolean): Indexed<I, T>;

  get(index: I): T | undefined;

  keys(): Collection<I> & Iterable<I>;

  map<R>(fn: (value: T, index: I) => R): Indexed<I, R>;

  set(index: I, item: T): Indexed<I, T>;

  values(): Collection<T> & Iterable<T>;
}
