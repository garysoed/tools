import { BaseCollection } from './base-collection';
import { generatorFrom } from './generators';
import { IsFinite } from './is-finite';
import { TypedGenerator } from './typed-generator';

export class ImmutableList<T>
    extends BaseCollection<T, TypedGenerator<T> & IsFinite>
    implements IsFinite {
  readonly isFinite: true = true;

  constructor(generator: TypedGenerator<T> & IsFinite) {
    super(generator);
  }

  static create<T>(): (from: TypedGenerator<T> & IsFinite) => ImmutableList<T> {
    return (from: TypedGenerator<T> & IsFinite) => {
      return new ImmutableList(from);
    };
  }

  static of<T>(array: T[]): ImmutableList<T> {
    return new ImmutableList(generatorFrom(array));
  }
}
