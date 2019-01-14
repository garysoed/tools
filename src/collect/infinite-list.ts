import { BaseCollection } from './base-collection';
import { TypedGenerator } from './types/generator';

export class InfiniteList<T> extends BaseCollection<T, TypedGenerator<T>> {
  constructor(generator: TypedGenerator<T>) {
    super(generator);
  }
}
