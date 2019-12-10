import { Operator } from './operator';

export function intersect<T>(setB: ReadonlySet<T>): Operator<ReadonlySet<T>, ReadonlySet<T>> {
  return setA => {
    const intersectSet = new Set<T>();
    for (const item of setA) {
      if (setB.has(item)) {
        intersectSet.add(item);
      }
    }

    return new Set(intersectSet);
  };
}
