import { CompareResult } from '../interfaces/compare-result';
import { Finite } from '../interfaces/finite';
import { FiniteCollection } from '../interfaces/finite-collection';

export interface Ordered<T> extends Finite {
  deleteAt(index: number): Ordered<T>;

  equals(other: Ordered<T>): boolean;

  getAt(index: number): T | undefined;

  insertAllAt(index: number, items: FiniteCollection<T>): Ordered<T>;

  insertAt(index: number, item: T): Ordered<T>;

  reverse(): Ordered<T>;

  setAt(index: number, item: T): Ordered<T>;

  sort(compareFn: (item1: T, item2: T) => CompareResult): Ordered<T>;
}
