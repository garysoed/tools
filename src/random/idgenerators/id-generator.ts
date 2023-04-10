export function idGenerator<T>(values: Iterable<T>): Iterable<T> {
  return {
    *[Symbol.iterator]() {
      const usedValues = new Set<T>();
      for (const value of values) {
        if (usedValues.has(value)) {
          continue;
        }

        usedValues.add(value);
        yield value;
      }
    },
  };
}