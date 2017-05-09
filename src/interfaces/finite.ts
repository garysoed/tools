import { Collection } from '../interfaces/collection';

/**
 * A collection that has a finite size.
 */
export interface Finite<T> {
  /**
   * Adds the given item to the collection.
   * @param item The item to add.
   */
  add(item: T): Finite<T>;

  /**
   * Adds all the given items to the collection.
   */
  addAll(items: Collection<T> & Finite<T>): Finite<T>;

  /**
   * Deletes the given item from the collection.
   * @param item The item to delete.
   */
  delete(item: T): Finite<T>;

  /**
   * Delets all the given items from the collection.
   */
  deleteAll(items: Collection<T> & Finite<T>): Finite<T>;

  everyItem(check: (item: T) => boolean): boolean;

  /**
   * @return True iff the given item exists in the collection.
   */
  has(item: T): boolean;

  reduceItem<R>(fn: (prevItem: R, item: T) => R, init: R): R;

  /**
   * The number of items in the collection.
   */
  size(): number;

  someItem(check: (item: T) => boolean): boolean;
}
