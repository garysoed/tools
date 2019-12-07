export function intersect<T>(setA: ReadonlySet<T>, setB: ReadonlySet<T>): Set<T> {
  const intersectSet = new Set<T>();
  for (const item of setA) {
    if (setB.has(item)) {
      intersectSet.add(item);
    }
  }

  return intersectSet;
}
