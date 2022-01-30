/**
 * Adds the given value to the set.
 *
 * @typeParam T - Type of the set element.
 * @thHidden
 */
export interface SetAdd<T> {
  readonly type: 'add';
  readonly value: T;
}

/**
 * Initializes the set by setting it to the given set.
 *
 * @typeParam T - Type of the set element.
 * @thHidden
 */
export interface SetInit<T> {
  readonly type: 'init';
  readonly value: Set<T>;
}

/**
 * Deletes the given value from the set.
 *
 * @typeParam T - Type of the set element.
 * @thHidden
 */
export interface SetDelete<T> {
  readonly type: 'delete';
  readonly value: T;
}

/**
 * Differences between sets.
 *
 * @typeParam T - Type of the set element.
 * @thHidden
 */
export type SetDiff<T> = SetInit<T>|SetDelete<T>|SetAdd<T>;

/**
 * Emits diffs of the input sets.
 *
 * @remarks
 * The first emission is always compared to empty set. Note that if the input set emissions change
 * a lot, there can be more output diffs than the input sets.
 *
 * @typeParam T - Type of the set element.
 * @returns Operator that takes in sets and emits diffs between subsequent set emissions.
 *
 * @thModule collect
 */
export function diffSet<T>(
    fromSet: ReadonlySet<T>,
    toSet: ReadonlySet<T>,
): ReadonlyArray<SetDiff<T>> {
  const diffs: Array<SetDiff<T>> = [];

  // Delete the extra items.
  for (const value of fromSet) {
    if (!toSet.has(value)) {
      diffs.push({value, type: 'delete'});
    }
  }

  // Insert the missing items.
  for (const value of toSet) {
    if (!fromSet.has(value)) {
      diffs.push({value, type: 'add'});
    }
  }

  return diffs;
}

/**
 * Given a sequence of `SetDiff`s, rebuild the set.
 *
 * @typeParam T - Type of element in the set.
 * @returns Operator that emits sets as applied to the input diffs.
 * @thModule collect
 */
export function undiffSet<T>(
    initSet: ReadonlySet<T>,
    diffs: ReadonlyArray<SetDiff<T>>,
): ReadonlySet<T> {
  return diffs.reduce(
      (acc, diff) => {
        switch (diff.type) {
          case 'add':
            return new Set([...acc, diff.value]);
          case 'init':
            return new Set(diff.value);
          case 'delete':
            return new Set([...acc].filter(v => v !== diff.value));
        }
      },
      initSet,
  );
}
