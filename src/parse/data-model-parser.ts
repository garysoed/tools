import { Serializer } from '../data';
import { DataModel, DataModels } from '../datamodel';
import { ANNOTATIONS } from '../datamodel/field';
import { Parser } from '../interfaces';
import { JsonParser } from '../parse';

export const TYPE_FIELD_ = '_type';

class DataModelParserImpl<T extends DataModel<any>> implements Parser<T> {
  private fromJson_<T extends DataModel<any>>(json: gs.IJson): T {
    const serializedName = json[TYPE_FIELD_];
    if (!serializedName) {
      throw new Error('No serialized names found');
    }

    return this.fromJsonDataModel_(json, serializedName);
  }

  private fromJsonDataModel_(json: gs.IJson, serializedName: string): any {
    const baseClass = Serializer.getRegisteredCtor(serializedName);
    if (!baseClass) {
      throw new Error(`No constructors found for ${serializedName}`);
    }

    const instance = DataModels.newInstance(baseClass);
    for (const [key, configs] of ANNOTATIONS.forCtor(baseClass).getAttachedValues()) {
      for (const {parser, serializedFieldName} of configs) {
        const jsonValue = json[serializedFieldName];
        if (jsonValue !== undefined) {
          instance[key] = parser.parse(jsonValue);
        }
      }
    }

    return instance;
  }

  parse(value: string | null): T | null {
    if (value === null) {
      return null;
    }

    const json = JsonParser.parse(value);
    if (json === null) {
      return null;
    }

    return this.fromJson_<T>(json);
  }

  stringify(value: T | null): string {
    return JsonParser.stringify(value === null ? null : this.toJson_(value));
  }

  private toJson_(obj: any): gs.IJson {
    const serializedName = DataModels.getSerializedName(obj);
    if (!serializedName) {
      throw new Error(`Object ${obj} was not created with DataModels or is not serializable`);
    }

    return this.toJsonDataModel_(obj, serializedName);
  }

  private toJsonDataModel_(obj: any, serializedName: string): gs.IJson {
    const json: object = {[TYPE_FIELD_]: serializedName};
    const baseClass = Serializer.getRegisteredCtor(serializedName);

    if (!baseClass) {
      throw new Error(`No constructors found for ${serializedName}`);
    }

    for (const [key, configs] of ANNOTATIONS.forCtor(baseClass).getAttachedValues()) {
      for (const {parser, serializedFieldName} of configs) {
        json[serializedFieldName] = parser.stringify(obj[key]);
      }
    }
    return json;
  }
}

export function DataModelParser<T extends DataModel<any>>(): Parser<T> {
  return new DataModelParserImpl<T>();
}
