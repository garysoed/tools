import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';
import { ListParser } from './list-parser';
import { Parser } from './parser';

export class SetParserImpl<T> implements Parser<ImmutableSet<T|null>> {
  private readonly listParser_: Parser<ImmutableList<T|null>>;

  constructor(elementParser: Parser<T>) {
    this.listParser_ = ListParser<T>(elementParser);
  }

  convertBackward(input: string|null): ImmutableSet<T|null>|null {
    const list = this.listParser_.convertBackward(input);
    if (!list) {
      return null;
    }

    return ImmutableSet.of(list);
  }

  convertForward(value: ImmutableSet<T|null>|null): string|null {
    if (value === null) {
      return '';
    }

    return this.listParser_.convertForward(ImmutableList.of(value));
  }
}

export function SetParser<T>(elementParser: Parser<T>): SetParserImpl<T> {
  return new SetParserImpl(elementParser);
}
