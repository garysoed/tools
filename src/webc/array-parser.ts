import {Arrays} from '../collection/arrays';

import {IAttributeParser} from './interfaces';


export const DELIMITER_: string = ',';

export class ArrayParserImpl<T> implements IAttributeParser<(T | null)[]> {
  private readonly elementParser_: IAttributeParser<T>;

  constructor(elementParser: IAttributeParser<T>) {
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


export function ArrayParser<T>(elementParser: IAttributeParser<T>): ArrayParserImpl<T> {
  return new ArrayParserImpl(elementParser);
}
