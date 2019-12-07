import { Converter, Result } from '@nabu';
import { hasEntry } from '../collection/operators/has-entry';
import { pipe } from '../collection/pipe';
import { createImmutableSet, ImmutableSet } from '../collection/types/immutable-set';


class StringMatchConverter<T extends string> implements Converter<T, string> {
  constructor(private readonly acceptableValues_: ImmutableSet<T>) { }

  convertBackward(value: string): Result<T> {
    const isAcceptable = pipe(this.acceptableValues_, hasEntry(value as T));
    if (!isAcceptable) {
      return {success: false};
    }

    return {result: value as T, success: true};
  }

  convertForward(input: T): Result<string> {
    const isAcceptable = pipe(this.acceptableValues_, hasEntry(input));
    if (!isAcceptable) {
      return {success: false};
    }

    return {result: input, success: true};
  }
}

export function stringMatchConverter<T extends string>(
    acceptableValues: Iterable<T>,
): StringMatchConverter<T> {
  return new StringMatchConverter<T>(createImmutableSet([...acceptableValues]));
}
