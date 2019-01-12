import { BaseCollection } from './base-collection';
import { TypedGenerator } from './operators/typed-generator';

export class InfiniteList<T> extends BaseCollection<T, TypedGenerator<T>> {
  constructor(private readonly generator: TypedGenerator<T>) {
    super();
  }

  iterableFactory(): TypedGenerator<T> {
    return this.generator;
  }
}
