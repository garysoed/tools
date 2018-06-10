import { Type } from 'gs-types/export';

/**
 * A collection of stuff. This can be finite or infinite
 */
export interface Collection<T> extends Iterable<T> {
  filterByType<T2>(checker: Type<T2>): Collection<T2>;

  /**
   * Filters the items in the collection.
   * @param checker Function that takes in the checked item and return true iff the item should be
   *     in the resulting collection.
   */
  filterItem(checker: (item: T) => boolean): Collection<T>;

  /**
   * Transforms the items in the collection to another value.
   * @param fn The transformation function.
   */
  mapItem<R>(fn: (item: T) => R): Collection<R>;
}
