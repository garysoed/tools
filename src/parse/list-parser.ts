import { ImmutableList } from '../immutable';
import { Parser } from '../interfaces';

export class ListParserImpl<T> implements Parser<ImmutableList<T | null>> {
  private readonly elementParser_: Parser<T>;

  constructor(elementParser: Parser<T>) {
    this.elementParser_ = elementParser;
  }

  parse(input: string | null): ImmutableList<T | null> | null {
    if (input === null) {
      return null;
    }

    const array = JSON.parse(input) as string[];
    if (!array) {
      return null;
    }

    return ImmutableList
        .of(array)
        .map((element: string) => {
          return this.elementParser_.parse(element);
        });
  }

  stringify(value: ImmutableList<T | null> | null): string {
    if (value === null) {
      return '';
    }

    const list = value
        .map((element: T | null) => {
          return this.elementParser_.stringify(element);
        });
    return JSON.stringify([...list]);
  }
}

export function ListParser<T>(elementParser: Parser<T>): ListParserImpl<T> {
  return new ListParserImpl(elementParser);
}
