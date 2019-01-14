import { BaseCollection } from './base-collection';
import { generatorFrom } from './generators';
import { FiniteGenerator } from './types/generator';

export class ImmutableList<T>
    extends BaseCollection<T, FiniteGenerator<T>> {
  constructor(generator: FiniteGenerator<T>) {
    super(generator);
  }

  static create<T>(): (from: FiniteGenerator<T>) => ImmutableList<T> {
    return (from: FiniteGenerator<T>) => {
      return new ImmutableList(from);
    };
  }

  static of<T>(array: T[]): ImmutableList<T> {
    return new ImmutableList(generatorFrom(array));
  }
}
