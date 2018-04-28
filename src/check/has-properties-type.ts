import { Type } from '../check/type';

export function HasPropertiesType<OBJ>(spec: {[KEY in keyof OBJ]: Type<OBJ[KEY]>}): Type<OBJ> {
  return {
    check(target: any): target is OBJ {
      if (!(target instanceof Object)) {
        return false;
      }

      for (const key in spec) {
        if (!spec[key].check(target[key])) {
          return false;
        }
      }

      return true;
    },

    toString(): string {
      const entries: string[] = [];
      for (const key in spec) {
        entries.push(`${key}: ${spec[key]}`);
      }
      return `{${entries.join(', ')}}`;
    },
  };
}
