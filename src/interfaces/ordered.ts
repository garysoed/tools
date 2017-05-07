import { CompareResult } from '../interfaces/compare-result';
import { Finite } from '../interfaces/finite';

export interface Ordered<T> {
  deleteAt(index: number): Ordered<T>;

  get(index: number): T | undefined;

  insertAllAt(index: number, items: Finite<T> & Iterable<T>): Ordered<T>;

  insertAt(index: number, item: T): Ordered<T>;

  set(index: number, item: T): Ordered<T>;

  sort(compareFn: (item1: T, item2: T) => CompareResult): Ordered<T>;
}
