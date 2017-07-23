import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../interfaces/parser';
import { ListParser } from '../parse/list-parser';

export class SetParserImpl<T> implements Parser<ImmutableSet<T | null>> {
  private readonly listParser_: Parser<ImmutableList<T | null>>;

  constructor(elementParser: Parser<T>) {
    this.listParser_ = ListParser<T>(elementParser);
  }

  parse(input: string | null): ImmutableSet<T | null> | null {
    const list = this.listParser_.parse(input);
    if (!list) {
      return list;
    }

    return ImmutableSet.of(list);
  }

  stringify(value: ImmutableSet<T | null> | null): string {
    if (value === null) {
      return '';
    }

    return this.listParser_.stringify(ImmutableList.of(value));
  }
}

export function SetParser<T>(elementParser: Parser<T>): SetParserImpl<T> {
  return new SetParserImpl(elementParser);
}
