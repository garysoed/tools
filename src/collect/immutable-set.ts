import { BaseCollection } from './base-collection';
import { generatorFrom } from './generators';
import { distinct } from './operators/distinct';
import { transform } from './transform';
import { TypedGenerator } from './types/generator';

export class ImmutableSet<T> extends BaseCollection<T, void, TypedGenerator<T, void>> {
  static create<T>(): (from: TypedGenerator<T, void>) => ImmutableSet<T> {
    return from => new ImmutableSet(from);
  }

  static of<T>(input: T[]|Set<T>): ImmutableSet<T> {
    return new ImmutableSet(
        transform(
            generatorFrom([...input]),
            distinct(),
        ),
    );
  }
}
