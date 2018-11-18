import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ListParser } from '../parse/list-parser';
import { StringParser } from '../parse/string-parser';
import { Parser } from './parser';


export class EntryParser<K, V> implements Parser<[K, V|null]> {
  private readonly listParser_: Parser<ImmutableList<string|null>> =
      ListParser<string>(StringParser);
  constructor(
      private readonly keyParser_: Parser<K>,
      private readonly valueParser_: Parser<V>) { }

  convertBackward(input: string|null): [K, V|null]|null {
    const stringList = this.listParser_.convertBackward(input);
    if (stringList === null) {
      return null;
    }

    if (stringList.size() !== 2) {
      return null;
    }

    const [stringKey, stringValue] = stringList;
    const key = this.keyParser_.convertBackward(stringKey);
    const value = this.valueParser_.convertBackward(stringValue);
    if (key === null) {
      return null;
    }

    return [key, value];
  }

  convertForward(stringValue: [K, V|null]|null): string {
    if (stringValue === null) {
      return '';
    }

    const [key, value] = stringValue;

    return JSON.stringify([
      this.keyParser_.convertForward(key),
      this.valueParser_.convertForward(value),
    ]);
  }
}

export class MapParserImpl<K, V> implements Parser<ImmutableMap<K, V|null>> {
  private readonly listParser_: Parser<ImmutableList<[K, V|null]|null>>;

  constructor(keyParser: Parser<K>, valueParser: Parser<V>) {
    this.listParser_ = ListParser(new EntryParser(keyParser, valueParser));
  }

  convertBackward(input: string|null): ImmutableMap<K, V|null>|null {
    const list = this.listParser_.convertBackward(input);
    if (list === null) {
      return null;
    }

    const filteredList = list.filterItem((item: [K, V|null]|null) => item !== null);

    return ImmutableMap.of<K, V|null>(filteredList as ImmutableList<[K, V|null]>);
  }

  convertForward(value: ImmutableMap<K, V|null>|null): string|null {
    if (value === null) {
      return '';
    }

    return this.listParser_.convertForward(ImmutableList.of(value.entries()));
  }
}

export function MapParser<K, V>(
    keyParser: Parser<K>,
    valueParser: Parser<V>): Parser<ImmutableMap<K, V|null>> {
  return new MapParserImpl(keyParser, valueParser);
}
