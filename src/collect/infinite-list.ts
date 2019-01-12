import { BaseCollection } from './base-collection';
import { TypedGenerator } from './operators/typed-generator';

export class InfiniteList<T> extends BaseCollection<T> {
  /**
   * @param generator Function the elements in the list, given a key. If the return value is
   *     undefined, the element should not be added to the list.
   */
  constructor(private readonly generator: TypedGenerator<T>) {
    super();
  }

  iterableFactory(): TypedGenerator<T> {
    return this.generator;
  }
}
