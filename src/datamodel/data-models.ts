import { getSerializedName_ } from '../data/serializer';
import { DataModel } from '../datamodel/data-model';
import { annotationKey as ANNOTATIONS } from '../datamodel/field';
import { ImmutableMap } from '../immutable/immutable-map';

export const __serializedName = Symbol('serializedName');

export class DataModels {
  static createGetter_(instance: any, key: string | symbol): () => any {
    return () => instance[key];
  }

  static createSetter_<T, I extends DataModel<any>>(
      ctor: new (...args: any[]) => I,
      instance: I,
      key: string | symbol,
      eqFn: (item1: T, item2: T) => boolean): (newValue: T) => I {
    return (newValue: T) => {
      if (eqFn((instance as any)[key], newValue)) {
        return instance;
      }

      // Clone the instance.
      const newInstance = DataModels.newInstance<I>(ctor);
      for (const [annotationKey] of ANNOTATIONS.forCtor(ctor).getAttachedValues()) {
        (newInstance as any)[annotationKey] = (instance as any)[annotationKey];
      }

      (newInstance as any)[key] = newValue;

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
        (instance as any)[`get${fieldName}`] = DataModels.createGetter_(instance, key);
        (instance as any)[`set${fieldName}`] = DataModels
            .createSetter_<any, T>(baseClass, instance, key, eqFn);
      }

      const initValue = init.get(key);
      if (initValue !== undefined) {
        (instance as any)[key] = initValue;
      }
    }

    const serializedName = getSerializedName_(baseClass.prototype);
    if (serializedName) {
      (instance as any)[__serializedName] = serializedName;
    }

    return instance;
  }
}
