export class FluentIterable<T> implements Iterable<T> {
  constructor(private readonly wrappedIterable: Iterable<T>) { }

  [Symbol.iterator](): Iterator<T> {
    return this.wrappedIterable[Symbol.iterator]();
  }

  /**
   * Returns iterable with the values mapped from the given function.
   */
  map<D>(mapFn: (from: T) => D): FluentIterable<D> {
    const wrappedIterable = this.wrappedIterable;
    return new FluentIterable((function*(): Generator<D> {
      for (const item of wrappedIterable) {
        yield mapFn(item);
      }
    })());
  }

  /**
   * Grabs the first `count` elements from the iterable.
   */
  take(count: number): FluentIterable<T> {
    const wrappedIterable = this.wrappedIterable;
    return new FluentIterable((function*(): Generator<T> {
      let i = 0;
      for (const item of wrappedIterable) {
        if (i >= count) {
          break;
        }
        yield item;
        i++;
      }
    })());
  }
}
