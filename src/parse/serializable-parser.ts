import { Serializer } from '../data/a-serializable';
import { Parser } from '../interfaces/parser';
import { JsonParser } from '../parse/json-parser';

export function SerializableParser<T>(): Parser<T> {
  return {
    parse(value: string | null): T | null {
      if (value === null) {
        return null;
      }

      const json = JsonParser.parse(value);
      if (json === null) {
        return null;
      }

      return Serializer.fromJSON(json);
    },

    stringify(value: T | null): string {
      if (value === null) {
        return '';
      }

      return JsonParser.stringify(Serializer.toJSON(value));
    },
  };
}
