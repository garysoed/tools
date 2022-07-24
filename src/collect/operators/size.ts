import {Operator} from '../../typescript/operator';

/**
 * Collections with a known size.
 *
 * @hidden
 */
export type HasSize = ReadonlySet<any>|ReadonlyMap<any, any>|readonly any[];

/**
 * Returns the size of the input collection.
 *
 * @remarks
 * The input collection needs to have a known size, so it cannot be an {@link Iterable}.
 *
 * @returns `Operator` that returns the number of items in the given collection.
 * @thModule collect.operators
 */
export function $size(): Operator<HasSize, number> {
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
