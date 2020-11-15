import {Ordering} from '../compare/ordering';

/**
 * Collections that can be sorted.
 *
 * @typeParam T - Type of items in the collection.
 * @thModule collect.structures.
 */
export interface Sortable<T> {
  /**
   * Sorts the collection with the given `Ordering`.
   *
   * @param ordering - Logic to sort the collection with.
   */
  sort(ordering: Ordering<T>): void;
}
