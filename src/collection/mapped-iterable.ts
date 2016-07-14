/**
 * An iterable whose elements have been transformed using the given mapping function.
 *
 * @param <T> The type of the element in the original iterable.
 * @param <T2> The type of the element in the transformed iterable.
 */
export class MappedIterable<T, T2> implements Iterable<T2> {
  private iterable_: Iterable<T>;
  private mapFn_: (value: T) => T2;

  constructor(iterable: Iterable<T>, mapFn: (value: T) => T2) {
    this.iterable_ = iterable;
    this.mapFn_ = mapFn;
  }

  [Symbol.iterator](): Iterator<T2> {
    let iterator = this.iterable_[Symbol.iterator]();
    let mapFn = this.mapFn_;
    return {
      next(): IteratorResult<T2> {
        let result = iterator.next();
        return {done: result.done, value: mapFn(result.value)};
      },
    };
  }

  /**
   * Creates a new instance of `MappedIterable`.
   *
   * @param iterable The original iterable.
   * @param mapFn The mapping function. This takes an element from the original iterable and return
   *    the element to be used in the transformed iterable.
   * @param <T> The type of the element in the original iterable.
   * @param <T2> The type of the element in the transformed iterable.
   *
   * @return The new instance of `MappedIterable`.
   */
  static newInstance<T, T2>(iterable: Iterable<T>, mapFn: (value: T) => T2): MappedIterable<T, T2> {
    return new MappedIterable<T, T2>(iterable, mapFn);
  }
}
