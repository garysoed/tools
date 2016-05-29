export class ArrayIterator<T> implements Iterator<T> {
  private array_: T[];
  private index_: number;

  constructor(array: T[]) {
    this.array_ = array;
    this.index_ = 0;
  }

  next(): IteratorResult<T> {
    let value = this.array_[this.index_];
    let done = this.array_.length <= this.index_;
    this.index_++;
    return {
      value: value,
      done: done
    };
  }
}

/**
 * Iterable with an array as the backing storage.
 *
 * @param <T> The type of the elements in the iterable.
 */
export class ArrayIterable<T> implements Iterable<T> {
  private array_: T[];

  constructor(array: T[]) {
    this.array_ = array;
  }

  [Symbol.iterator](): Iterator<T> {
    return new ArrayIterator<T>(this.array_);
  }

  /**
   * Creates a new instance of `ArrayIterable`.
   *
   * @param array The array to iterate through.
   * @param <T> The type of elements in the iterable.
   *
   * @return New instance of `ArrayIterable`.
   */
  static newInstance<T>(array: T[]): ArrayIterable<T> {
    return new ArrayIterable<T>(array);
  }
}
