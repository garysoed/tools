import { Arrays } from '../collection/arrays';

import { Parser } from '../interfaces/parser';


export const DELIMITER_: string = ',';

export class ArrayParserImpl<T> implements Parser<(T | null)[]> {
  private readonly elementParser_: Parser<T>;

  constructor(elementParser: Parser<T>) {
    this.elementParser_ = elementParser;
  }

  parse(input: string | null): (T | null)[] | null {
    if (input === null) {
      return null;
    }

    return Arrays
        .of(input.split(DELIMITER_))
        .map((element: string) => {
          return this.elementParser_.parse(element);
        })
        .asArray();
  }

  stringify(value: (T | null)[] | null): string {
    if (value === null) {
      return '';
    }

    return Arrays
        .of(value)
        .map((element: T | null) => {
          return this.elementParser_.stringify(element);
        })
        .asArray()
        .join(DELIMITER_);
  }
}


export function ArrayParser<T>(elementParser: Parser<T>): ArrayParserImpl<T> {
  return new ArrayParserImpl(elementParser);
}
// TODO: Mutable
