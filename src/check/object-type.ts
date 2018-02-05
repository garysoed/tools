import { InstanceofType } from '../check/instanceof-type';
import { NumberType } from '../check/number-type';
import { StringType } from '../check/string-type';
import { Type } from '../check/type';

class GenericObjectType<T> {
  constructor(
      private readonly keyType_: Type<any>,
      private readonly valueType_: Type<any>) { }

  check(target: any): target is T {
    if (!InstanceofType(Object).check(target)) {
      return false;
    }

    for (const key in target) {
      if (!this.keyType_.check(key)) {
        return false;
      }

      if (!this.valueType_.check(target[key])) {
        return false;
      }
    }

    return true;
  }

  toString(): string {
    return `{[key: ${this.keyType_}]: ${this.valueType_}}`;
  }
}

export const ObjectType = {
  numberKeyed<V>(valueType: Type<V>): Type<{[key: number]: V}> {
    return new GenericObjectType<{[key: number]: V}>(NumberType, valueType);
  },

  stringKeyed<V>(valueType: Type<V>): Type<{[key: string]: V}> {
    return new GenericObjectType<{[key: string]: V}>(StringType, valueType);
  },
};
