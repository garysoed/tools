interface DiffResult<T> {
  added: Iterable<T>;
  deleted: Iterable<T>;
  unchanged: Iterable<T>;
}

export function diff<T>(
  oldIterable: Iterable<T>,
  newIterable: Iterable<T>,
): DiffResult<T> {
  const oldSet = new Set<T>(oldIterable);
  const newSet = new Set<T>(newIterable);

  const added = new Set<T>();
  const unchanged = new Set<T>();
  for (const item of newSet) {
    if (oldSet.has(item)) {
      unchanged.add(item);
    } else {
      added.add(item);
    }
  }

  const deleted = new Set<T>();
  for (const item of oldSet) {
    if (!newSet.has(item)) {
      deleted.add(item);
    }
  }

  return {added, deleted, unchanged};
}
