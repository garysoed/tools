import { Collection } from './collection';
import { Finite } from './finite';
import { Ordered } from './ordered';
import { Ordering } from '../collect/ordering';

/**
 * A collection that has a finite size.
 */
export interface FiniteCollection<T> extends Finite, Collection<T> {
  /**
   * Adds the given item to the collection.
   * @param item The item to add.
   */
  add(item: T): Finite;

  /**
   * Adds all the given items to the collection.
   */
  addAll(items: Collection<T>): Finite;

  /**
   * Deletes the given item from the collection.
   * @param item The item to delete.
   */
  delete(item: T): Finite;

  /**
   * Delets all the given items from the collection.
   */
  deleteAll(items: FiniteCollection<T>): Finite;

  everyItem(check: (item: T) => boolean): boolean;

  find(check: (item: T) => boolean): T | null;

  /**
   * @return True iff the given item exists in the collection.
   */
  has(item: T): boolean;

  max(ordering: Ordering<T>): T | null;

  min(ordering: Ordering<T>): T | null;

  reduceItem<R>(fn: (prevItem: R, item: T) => R, init: R): R;

  /**
   * The number of items in the collection.
   */
  size(): number;

  someItem(check: (item: T) => boolean): boolean;

  sort(compareFn: Ordering<T>): Ordered<T>;
}
