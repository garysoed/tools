export class FluentSet<T> extends Set<T> {
  constructor(source: Set<T>) {
    super(source);
  }

  intersect(setB: ReadonlySet<T>): FluentSet<T> {
    const intersectSet = new Set<T>();
    for (const item of this) {
      if (setB.has(item)) {
        intersectSet.add(item);
      }
    }

    return new FluentSet(intersectSet);
  }
}
