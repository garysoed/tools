import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { Parser } from '../interfaces/parser';
import { ListParser } from '../parse/list-parser';
import { StringParser } from '../parse/string-parser';


export class EntryParser<K, V> implements Parser<[K, V | null]> {
  private readonly listParser_: Parser<ImmutableList<string | null>> =
      ListParser<string>(StringParser);
  constructor(
      private readonly keyParser_: Parser<K>,
      private readonly valueParser_: Parser<V>) { }

  parse(input: string | null): [K, V | null] | null {
    const stringList = this.listParser_.parse(input);
    if (stringList === null) {
      return null;
    }

    if (stringList.size() !== 2) {
      return null;
    }

    const [stringKey, stringValue] = stringList;
    const key = this.keyParser_.parse(stringKey);
    const value = this.valueParser_.parse(stringValue);
    if (key === null) {
      return null;
    }

    return [key, value];
  }

  stringify(stringValue: [K, V | null] | null): string {
    if (stringValue === null) {
      return '';
    }

    const [key, value] = stringValue;
    return JSON.stringify([this.keyParser_.stringify(key), this.valueParser_.stringify(value)]);
  }
}

export class MapParserImpl<K, V> implements Parser<ImmutableMap<K, V | null>> {
  private readonly listParser_: Parser<ImmutableList<[K, V | null] | null>>;

  constructor(keyParser: Parser<K>, valueParser: Parser<V>) {
    this.listParser_ = ListParser(new EntryParser(keyParser, valueParser));
  }

  parse(input: string | null): ImmutableMap<K, V | null> | null {
    const list = this.listParser_.parse(input);
    if (list === null) {
      return null;
    }

    const filteredList = list.filterItem((item: [K, V | null] | null) => item !== null);
    return ImmutableMap.of<K, V | null>(filteredList as ImmutableList<[K, V | null]>);
  }

  stringify(value: ImmutableMap<K, V | null> | null): string {
    if (value === null) {
      return '';
    }
    return this.listParser_.stringify(ImmutableList.of(value.entries()));
  }
}

export function MapParser<K, V>(
    keyParser: Parser<K>,
    valueParser: Parser<V>): Parser<ImmutableMap<K, V | null>> {
  return new MapParserImpl(keyParser, valueParser);
}
