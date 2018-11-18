import { Finite } from './finite';
import { FiniteCollection } from './finite-collection';

export interface Ordered<T> extends Finite {
  deleteAt(index: number): Ordered<T>;

  equals(other: Ordered<T>): boolean;

  getAt(index: number): T | undefined;

  insertAllAt(index: number, items: FiniteCollection<T>): Ordered<T>;

  insertAt(index: number, item: T): Ordered<T>;

  pop(): Ordered<T>;

  push(item: T): Ordered<T>;

  reverse(): Ordered<T>;

  setAt(index: number, item: T): Ordered<T>;
}
