import { Operator } from './operator';

type HasSize = ReadonlySet<any>|ReadonlyMap<any, any>|readonly any[];

export function size(): Operator<HasSize, number> {
  return collection => {
    if (isArray(collection)) {
      return collection.length;
    }

    return collection.size;
  };
}

function isArray(target: HasSize): target is readonly any[] {
  return target instanceof Array;
}
