import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../interfaces/parser';
import { StringParser } from '../parse/string-parser';

export class StringSetParserImpl<T extends string> implements Parser<T> {
  constructor(private readonly acceptableValues_: ImmutableSet<T>) { }

  parse(input: string | null): T | null {
    return this.acceptableValues_.has(input as T) ? input as T : null;
  }

  stringify(value: T | null): string {
    return StringParser.stringify(value);
  }
}

export function StringSetParser<T extends string>(acceptableValues: T[]): Parser<T> {
  return new StringSetParserImpl<T>(ImmutableSet.of(acceptableValues));
}
