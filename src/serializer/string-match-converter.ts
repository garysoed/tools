import { Converter, Result } from 'nabu/export/main';
import { ImmutableSet } from '../collect/immutable-set';
import { hasEntry } from '../collect/operators/has-entry';


class StringMatchConverter<T extends string> implements Converter<T, string> {
  constructor(private readonly acceptableValues_: ImmutableSet<T>) { }

  convertBackward(value: string): Result<T> {
    const isAcceptable = this.acceptableValues_.$(hasEntry(value as T));
    if (!isAcceptable) {
      return {success: false};
    }

    return {result: value as T, success: true};
  }

  convertForward(input: T): Result<string> {
    const isAcceptable = this.acceptableValues_.$(hasEntry(input));
    if (!isAcceptable) {
      return {success: false};
    }

    return {result: input, success: true};
  }
}

export function stringMatchConverter<T extends string>(
    acceptableValues: Iterable<T>,
): StringMatchConverter<T> {
  return new StringMatchConverter<T>(ImmutableSet.of([...acceptableValues]));
}
