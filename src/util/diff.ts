interface DiffResult<T> {
  added: Iterable<T>;
  deleted: Iterable<T>;
  unchanged: Iterable<T>;
}

export function diff<T>(
    oldIterable: Iterable<T>,
    newIterable: Iterable<T>,
): DiffResult<T> {
  const oldSet = new Set(oldIterable);
  const newSet = new Set(newIterable);

  const added = new Set();
  const unchanged = new Set();
  for (const item of newSet) {
    if (oldSet.has(item)) {
      unchanged.add(item);
    } else {
      added.add(item);
    }
  }

  const deleted = new Set();
  for (const item of oldSet) {
    if (!newSet.has(item)) {
      deleted.add(item);
    }
  }

  return {added, deleted, unchanged};
}

