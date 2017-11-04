import { Type } from '../check';

export function EnumType<E>(enumType: gs.IEnum): Type<E> {
  return {
    check(target: any): target is E {
      return enumType[target] !== undefined;
    },

    toString(): string {
      return `Enum`;
    },
  };
}
