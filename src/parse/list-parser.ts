import { ImmutableList } from '../immutable';
import { Parser } from './parser';

export class ListParserImpl<T> implements Parser<ImmutableList<T>> {
  private readonly elementParser_: Parser<T>;

  constructor(elementParser: Parser<T>) {
    this.elementParser_ = elementParser;
  }

  convertBackward(input: string|null): ImmutableList<T>|null {
    if (!input) {
      return null;
    }

    const array = JSON.parse(input) as string[];
    if (!array) {
      return null;
    }

    const elements: T[] = [];
    for (const element of array) {
      const converted = this.elementParser_.convertBackward(element);
      if (converted === null) {
        return null;
      }

      elements.push(converted);
    }

    return ImmutableList.of(elements);
  }

  convertForward(value: ImmutableList<T>|null): string {
    if (value === null) {
      return '';
    }

    const list = value
        .map((element: T) => {
          return this.elementParser_.convertForward(element);
        });

    return JSON.stringify([...list]);
  }
}

export function ListParser<T>(elementParser: Parser<T>): ListParserImpl<T> {
  return new ListParserImpl(elementParser);
}
