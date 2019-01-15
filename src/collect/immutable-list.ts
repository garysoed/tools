import { BaseCollection } from './base-collection';
import { generatorFrom } from './generators';
import { TypedGenerator } from './types/generator';

export class ImmutableList<T> extends BaseCollection<T, void, TypedGenerator<T, void>> {
  static create<T>(): (from: TypedGenerator<T, any>) => ImmutableList<T> {
    return (from: TypedGenerator<T, any>) => {
      return new ImmutableList(from);
    };
  }

  static of<T>(array: T[]): ImmutableList<T> {
    return new ImmutableList(generatorFrom(array));
  }
}
