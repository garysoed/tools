import { BaseCollection } from './base-collection';
import { IterableFactory } from './operators/iterable-factory';

export class InfiniteList<T> extends BaseCollection<T> {
  /**
   * @param generator Function the elements in the list, given a key. If the return value is
   *     undefined, the element should not be added to the list.
   */
  constructor(
      private readonly generator: () => IterableIterator<T>) {
    super();
  }

  iterableFactory(): IterableFactory<T> {
    return this.generator;
  }
}
