import { DataModel } from '../datamodel/data-model';
import { DataModels } from '../datamodel/data-models';
import { Parser } from '../interfaces/parser';
import { JsonParser } from '../parse/json-parser';

export function DataModelParser<T extends DataModel<any>>(): Parser<T> {
  return {
    parse(value: string | null): T | null {
      if (value === null) {
        return null;
      }

      const json = JsonParser.parse(value);
      if (json === null) {
        return null;
      }

      return DataModels.fromJson<T>(json);
    },

    stringify(value: T | null): string {
      return JsonParser.stringify(DataModels.toJson(value));
    },
  };
}
