import { of as observableOf, OperatorFunction, pipe } from 'rxjs';
import { map, pairwise, startWith, switchMap } from 'rxjs/operators';

import { assertUnreachable } from '../../typescript/assert-unreachable';

import { ArrayDiff } from './array-observable';


export function diff<T>(
    oldArray: ReadonlyArray<T>,
    newArray: ReadonlyArray<T>,
): Iterable<ArrayDiff<T>> {
  const diffs: Array<ArrayDiff<T>> = [];
  let currArrayLength = oldArray.length;
  let i = 0;

  // Insert the missing items.
  while (i < newArray.length) {
    const existingItem = oldArray[i];
    const newItem = newArray[i];
    if (existingItem !== newItem) {
      diffs.push({index: i, type: 'insert', value: newItem});
      currArrayLength++;
    }
    i++;
  }

  // Delete the extra items.
  for (let i = currArrayLength - 1; i >= newArray.length; i--) {
    diffs.push({index: i, type: 'delete', value: oldArray[i]});
  }

  return diffs;
}

export function diffArray<T>(): OperatorFunction<readonly T[], ArrayDiff<T>> {
  return pipe(
      startWith([] as readonly T[]),
      pairwise(),
      map(([oldArray, newArray]) => diff(oldArray, newArray)),
      switchMap(diffs => observableOf(...diffs)),
  );
}

export function applyDiff<T>(array: T[], diff: ArrayDiff<T>): void {
  switch (diff.type) {
    case 'insert':
      array.splice(diff.index, 0, diff.value);

      return;
    case 'delete':
      array.splice(diff.index, 1);

      return;
    case 'init':
      array.splice(0, array.length, ...diff.value);

      return;
    case 'set':
      array[diff.index] = diff.value;

      return;
    default:
      assertUnreachable(diff);
  }
}
