import { SetDiff } from './set-observable';


export function diff<T>(oldSet: ReadonlySet<T>, newSet: ReadonlySet<T>): Iterable<SetDiff<T>> {
  const diffs: Array<SetDiff<T>> = [];

  // Delete the extra items.
  for (const value of oldSet) {
    if (!newSet.has(value)) {
      diffs.push({value, type: 'delete'});
    }
  }

  // Insert the missing items.
  for (const value of newSet) {
    if (!oldSet.has(value)) {
      diffs.push({value, type: 'add'});
    }
  }

  return diffs;
}

export function applyDiff<T>(set: Set<T>, diff: SetDiff<T>): void {
  switch (diff.type) {
    case 'add':
      set.add(diff.value);

      return;
    case 'delete':
      set.delete(diff.value);

      return;
    case 'init':
      set.clear();
      for (const value of diff.value) {
        set.add(value);
      }

      return;
  }
}
