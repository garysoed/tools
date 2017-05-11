import { Parser } from '../interfaces/parser';
import { deprecated } from '../typescript/deprecated';
import { Log } from '../util/log';

const LOGGER = Log.of('parse.ArrayParser');

export const DELIMITER_: string = ',';

export class ArrayParserImpl<T> implements Parser<(T | null)[]> {
  private readonly elementParser_: Parser<T>;

  constructor(elementParser: Parser<T>) {
    this.elementParser_ = elementParser;
  }

  @deprecated(LOGGER, 'Use ListParser')
  parse(input: string | null): (T | null)[] | null {
    if (input === null) {
      return null;
    }

    return input.split(DELIMITER_)
        .map((element: string) => {
          return this.elementParser_.parse(element);
        });
  }

  @deprecated(LOGGER, 'Use ListParser')
  stringify(value: (T | null)[] | null): string {
    if (value === null) {
      return '';
    }

    return value
        .map((element: T | null) => {
          return this.elementParser_.stringify(element);
        })
        .join(DELIMITER_);
  }
}

export function ArrayParser<T>(elementParser: Parser<T>): ArrayParserImpl<T> {
  return new ArrayParserImpl(elementParser);
}
// TODO: Mutable
