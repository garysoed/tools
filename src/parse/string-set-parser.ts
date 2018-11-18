import { ImmutableSet } from '../immutable/immutable-set';
import { StringParser } from '../parse/string-parser';
import { Parser } from './parser';

export class StringSetParserImpl<T extends string> implements Parser<T> {
  constructor(private readonly acceptableValues_: ImmutableSet<T>) { }

  convertBackward(input: string|null): T|null {
    return this.acceptableValues_.has(input as T) ? input as T : null;
  }

  convertForward(value: T|null): string|null {
    return StringParser.convertBackward(value);
  }
}

export function StringSetParser<T extends string>(acceptableValues: T[]): Parser<T> {
  return new StringSetParserImpl<T>(ImmutableSet.of(acceptableValues));
}
