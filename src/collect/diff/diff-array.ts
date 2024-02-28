import {diffValue} from './diff-value';

/**
 * Inserts the element of the array at the given index.
 *
 * @typeParam T - Type of the array element.
 * @thHidden
 */
export interface ArrayInsert<T> {
  readonly index: number;
  readonly type: 'insert';
  readonly value: T;
}

/**
 * Deletes the element of the array from the given index.
 *
 * @typeParam T - Type of the array element.
 * @thHidden
 */
export interface ArrayDelete<T> {
  readonly index: number;
  readonly type: 'delete';
  readonly value: T;
}

/**
 * Differences between arrays.
 *
 * @typeParam T - Type of the array element.
 * @thHidden
 */
export type ArrayDiff<T> = ArrayInsert<T> | ArrayDelete<T>;

/**
 * Emits diffs of the input arrays.
 *
 * @remarks
 * The first emission is always compared to empty array. Note that if the input array emissions
 * change a lot, there can be more output diffs than the input arrays.
 *
 * @typeParam T - Type of the array element.
 * @returns Operator that takes in arrays and emits diffs between subsequent array emissions.
 *
 * @thModule collect
 */
export function diffArray<T>(
  fromArray: readonly T[],
  toArray: readonly T[],
  diffFn: (a: T, b: T) => boolean = (a, b) => a === b,
): ReadonlyArray<ArrayDiff<T>> {
  const diffs: Array<ArrayDiff<T>> = [];
  const currArray = [...fromArray];
  let i = 0;

  // Insert the missing items.
  while (i < toArray.length) {
    const existingItem = currArray[i];
    const newItem = toArray[i];
    if (!diffValue(existingItem, newItem, diffFn)) {
      currArray.splice(i, 0, newItem);
      diffs.push({index: i, type: 'insert', value: newItem});
    }
    i++;
  }

  // Delete the extra items.
  for (let i = currArray.length - 1; i >= toArray.length; i--) {
    diffs.push({index: i, type: 'delete', value: currArray[i]});
  }

  return diffs;
}

/**
 * Given a sequence of `ArrayDiff`s, rebuild the array.
 *
 * @typeParam T - Type of element in the array.
 * @returns Operator that emits arrays as applied to the input diffs.
 * @thModule collect
 */
export function undiffArray<T>(
  initArray: readonly T[],
  diffs: ReadonlyArray<ArrayDiff<T>>,
): readonly T[] {
  return diffs.reduce((acc, diff) => {
    const copy = [...acc];
    switch (diff.type) {
      case 'delete':
        copy.splice(diff.index, 1);

        return copy;
      case 'insert':
        copy.splice(diff.index, 0, diff.value);

        return copy;
    }
  }, initArray);
}
