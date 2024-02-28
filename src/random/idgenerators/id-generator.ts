export function* idGenerator<T>(values: Iterable<T>): Generator<T, T, void> {
  const usedValues = new Set<T>();
  for (const value of values) {
    if (usedValues.has(value)) {
      continue;
    }

    usedValues.add(value);
    yield value;
  }

  throw new Error('Ran out of ID candidates');
}
