/**
 * An iterable whose elements are filtered.
 *
 * @param <T> Type of element in the iterable.
 */
export class FilteredIterable<T> implements Iterable<T> {
  private filter_: (value: T) => boolean;
  private iterable_: Iterable<T>;

  constructor(iterable: Iterable<T>, filter: (value: T) => boolean) {
    this.iterable_ = iterable;
    this.filter_ = filter;
  }

  [Symbol.iterator](): Iterator<T> {
    const iterator = this.iterable_[Symbol.iterator]();
    const filter = this.filter_;
    return {
      next(): IteratorResult<T> {
        let result = iterator.next();
        while (!result.done && !filter(result.value)) {
          result = iterator.next();
        }

        return {done: result.done, value: result.value};
      },
    };
  }

  /**
   * Creates a new instance of the `FilteredIterable`.
   *
   * @param iterable The unfiltered iterable object.
   * @param filter The filter function. This takes in the element of the iterable and should return
   *    true iff the element should be in the resulting iterable.
   * @param <T> Type of element in the iterable.
   *
   * @return New instane of `FilteredIterable`.
   */
  static newInstance<T>(iterable: Iterable<T>, filter: (value: T) => boolean): FilteredIterable<T> {
    return new FilteredIterable<T>(iterable, filter);
  }
}
