import {Converter, Result} from 'nabu';


class StringMatchConverter<T extends string> implements Converter<T, string> {
  constructor(private readonly acceptableValues_: ReadonlySet<T>) { }

  convertBackward(value: string): Result<T> {
    const isAcceptable = this.acceptableValues_.has(value as T);
    if (!isAcceptable) {
      return {success: false};
    }

    return {result: value as T, success: true};
  }

  convertForward(input: T): Result<string> {
    const isAcceptable = this.acceptableValues_.has(input);
    if (!isAcceptable) {
      return {success: false};
    }

    return {result: input, success: true};
  }
}

export function stringMatchConverter<T extends string>(
    acceptableValues: Iterable<T>,
): StringMatchConverter<T> {
  return new StringMatchConverter<T>(new Set([...acceptableValues]));
}
