/**
 * Chains two iterables together into one iterable.
 *
 * @param <T> The type of element in the iterable.
 */
export class ChainIterable<T> implements Iterable<T> {
  private first_: Iterable<T>;
  private second_: Iterable<T>;

  constructor(first: Iterable<T>, second: Iterable<T>) {
    this.first_ = first;
    this.second_ = second;
  }

  [Symbol.iterator](): Iterator<T> {
    const firstIterator = this.first_[Symbol.iterator]();
    const secondIterator = this.second_[Symbol.iterator]();
    let firstIteratorDone = false;
    return {
      next(): IteratorResult<T> {
        let result;
        if (!firstIteratorDone) {
          result = firstIterator.next();
          firstIteratorDone = result.done;
        }

        if (firstIteratorDone) {
          result = secondIterator.next();
        }
        return result;
      },
    };
  }

  /**
   * Creats a new instance of ChainIterable.
   *
   * @param first The first iterable in the chain.
   * @param second The second iterable in the chain.
   * @param <T> The type of the element in the iterable.
   * @return A new instance of ChainIterable.
   */
  static newInstance<T>(first: Iterable<T>, second: Iterable<T>): ChainIterable<T> {
    return new ChainIterable(first, second);
  }
}
