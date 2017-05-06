import { Collection } from '../immutable/collection';

/**
 * A collection that has a finite size.
 */
export interface Finite<T> extends Collection<T> {
  /**
   * Adds the given item to the collection.
   * @param item The item to add.
   */
  add(item: T): Finite<T>;

  /**
   * Deletes the given item from the collection.
   * @param item The item to delete.
   */
  delete(item: T): Finite<T>;

  /**
   * @return True iff the given item exists in the collection.
   */
  has(item: T): boolean;

  /**
   * The number of items in the collection.
   */
  size(): number;
}
