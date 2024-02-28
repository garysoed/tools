import {Operator} from '../../typescript/operator';

/**
 * Returns {@link Set} of items that are in the input `Set` and in the given `Set`.
 *
 * @typeParam T - Type of items in the `Set`.
 * @param otherSet - Other set to compare to.
 * @returns `Operator` that returns `Set` of items in the input and the given `Set`s.
 * @thModule collect.operators
 */
export function $intersect<T>(
  otherSet: ReadonlySet<T>,
): Operator<ReadonlySet<T>, ReadonlySet<T>> {
  return (setA) => {
    const intersectSet = new Set<T>();
    for (const item of setA) {
      if (otherSet.has(item)) {
        intersectSet.add(item);
      }
    }

    return new Set(intersectSet);
  };
}
