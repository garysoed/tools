import { Serializer } from '../data/a-serializable';
import { DataModel } from '../datamodel/data-model';
import { ANNOTATIONS } from '../datamodel/field';
import { ImmutableMap } from '../immutable/immutable-map';

export const __serializedName = Symbol('serializedName');

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

  static getSerializedName(obj: any): string | null {
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
}
