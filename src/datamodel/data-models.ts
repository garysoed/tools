import { BooleanType } from '../check/boolean-type';
import { NumberType } from '../check/number-type';
import { StringType } from '../check/string-type';
import { UnionType } from '../check/union-type';
import { Serializer } from '../data/a-serializable';
import { DataModel } from '../datamodel/data-model';
import { ANNOTATIONS } from '../datamodel/field';
import { ImmutableMap } from '../immutable/immutable-map';

const SimpleJsonType = UnionType.builder<number | string | boolean>()
    .addType(NumberType)
    .addType(StringType)
    .addType(BooleanType)
    .build();

export const __serializedName = Symbol('serializedName');
export const TYPE_FIELD_ = '_type';

export class DataModels {
  private static createGetter_(instance: any, key: string | symbol): () => any {
    return () => instance[key];
  }

  private static createSetter_<T, I extends DataModel<any>>(
      ctor: new (...args: any[]) => I,
      instance: I,
      key: string | symbol,
      eqFn: (item1: T, item2: T) => boolean): (newValue: T) => I {
    return (newValue: T) => {
      if (eqFn(instance[key], newValue)) {
        return instance;
      }

      // Clone the instance.
      const newInstance = DataModels.newInstance<I>(ctor);
      for (const [key] of ANNOTATIONS.forCtor(ctor).getAttachedValues()) {
        newInstance[key] = instance[key];
      }

      newInstance[key] = newValue;
      return newInstance;
    };
  }

  static fromJson<T extends DataModel<any>>(json: gs.IJson): T {
    const serializedName = json[TYPE_FIELD_];
    if (!serializedName) {
      throw new Error('No serialized names found');
    }

    return DataModels.fromJsonDataModel_(json, serializedName);
  }

  private static fromJsonDataModel_(json: gs.IJson, serializedName: string): any {
    const baseClass = Serializer.getRegisteredCtor(serializedName);
    if (!baseClass) {
      throw new Error(`No constructors found for ${serializedName}`);
    }

    const instance = DataModels.newInstance(baseClass);
    for (const [key, configs] of ANNOTATIONS.forCtor(baseClass).getAttachedValues()) {
      for (const {serializedFieldName} of configs) {
        instance[key] = DataModels.fromJsonValue_(json[serializedFieldName]);
      }
    }

    return instance;
  }

  private static fromJsonValue_(json: any): any {
    if (SimpleJsonType.check(json)) {
      return json;
    }

    const serializedName = json[TYPE_FIELD_];
    return serializedName ?
        DataModels.fromJsonDataModel_(json, serializedName) :
        Serializer.fromJSON(json);
  }

  private static getSerializedName_(obj: any): string | null {
    return obj[__serializedName] || null;
  }

  static newInstance<T extends DataModel<any>>(
      baseClass: any,
      init: ImmutableMap<string | symbol, any> = ImmutableMap.of<string | symbol, any>([])): T {
    class GenClass extends baseClass { }
    const instance = (new GenClass()) as T;
    for (const [key, configs] of ANNOTATIONS.forCtor(baseClass).getAttachedValues()) {
      for (const {eqFn, fieldName} of configs) {
        instance[`get${fieldName}`] = DataModels.createGetter_(instance, key);
        instance[`set${fieldName}`] = DataModels
            .createSetter_<any, T>(baseClass, instance, key, eqFn);
      }

      const initValue = init.get(key);
      if (initValue !== undefined) {
        instance[key] = initValue;
      }
    }

    const serializedName = Serializer.getSerializedName(baseClass.prototype);
    if (serializedName) {
      instance[__serializedName] = serializedName;
    }

    return instance;
  }

  static toJson(obj: any): gs.IJson {
    const serializedName = DataModels.getSerializedName_(obj);
    if (!serializedName) {
      throw new Error(`Object ${obj} was not created with DataModels or is not serializable`);
    }

    return DataModels.toJsonDataModel_(obj, serializedName);
  }

  private static toJsonDataModel_(obj: any, serializedName: string): gs.IJson {
    const json: object = {[TYPE_FIELD_]: serializedName};
    const baseClass = Serializer.getRegisteredCtor(serializedName);

    if (!baseClass) {
      throw new Error(`No constructors found for ${serializedName}`);
    }

    for (const [key, configs] of ANNOTATIONS.forCtor(baseClass).getAttachedValues()) {
      for (const config of configs) {
        json[config.serializedFieldName] = DataModels.toJsonValue_(obj[key]);
      }
    }
    return json;
  }

  private static toJsonValue_(obj: any): string | number | boolean | gs.IJson {
    if (SimpleJsonType.check(obj)) {
      return obj;
    }

    const serializedName = DataModels.getSerializedName_(obj);
    if (!serializedName) {
      return Serializer.toJSON(obj);
    } else {
      return DataModels.toJsonDataModel_(obj, serializedName);
    }
  }
}
