import { of as observableOf, OperatorFunction, pipe } from 'rxjs';
import { map, pairwise, scan, startWith, switchMap } from 'rxjs/operators';


/**
 * Initializes the array by setting it to the given array.
 *
 * @typeParam T - Type of the array element.
 * @thHidden
 */
export interface ArrayInit<T> {
  readonly type: 'init';
  readonly value: readonly T[];
}

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
 * Sets the element of the array at the given index to the given value.
 *
 * @typeParam T - Type of the array element.
 * @thHidden
 */
export interface ArraySet<T> {
  readonly index: number;
  readonly type: 'set';
  readonly value: T;
}

/**
 * Differences between arrays.
 *
 * @typeParam T - Type of the array element.
 * @thHidden
 */
export type ArrayDiff<T> = ArrayInit<T>|ArrayInsert<T>|ArrayDelete<T>|ArraySet<T>;

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
 * @thModule rxjs.state
 */
export function diffArray<T>(
    diffFn: (a: T, b: T) => boolean = (a, b) => a === b,
): OperatorFunction<readonly T[], ArrayDiff<T>> {
  return pipe(
      startWith([] as readonly T[]),
      pairwise(),
      map(([oldArray, newArray]) => {
        const diffs: Array<ArrayDiff<T>> = [];
        const currArray = [...oldArray];
        let i = 0;

        // Insert the missing items.
        while (i < newArray.length) {
          const existingItem = currArray[i];
          const newItem = newArray[i];
          if (!diffValue(existingItem, newItem, diffFn)) {
            currArray.splice(i, 0, newItem);
            diffs.push({index: i, type: 'insert', value: newItem});
          }
          i++;
        }

        // Delete the extra items.
        for (let i = currArray.length - 1; i >= newArray.length; i--) {
          diffs.push({index: i, type: 'delete', value: currArray[i]});
        }

        return diffs;
      }),
      switchMap(diffs => observableOf(...diffs)),
  );
}

function diffValue<T>(a: T|undefined, b: T|undefined, helper: (a: T, b: T) => boolean): boolean {
  if (a !== undefined && b !== undefined) {
    return helper(a, b);
  }

  return a === b;
}


/**
 * Maps the value of the array diffs.
 *
 * @typeParam F - Original type of the array.
 * @typeParam T - Destination type of the array.
 * @param mapFn - Map function to apply.
 * @returns Operator that maps the values of any input array diff using the given mapping function.
 *
 * @thModule rxjs.state
 */
export function mapArrayDiff<F, T>(mapFn: (from: F) => T):
    OperatorFunction<ArrayDiff<F>, ArrayDiff<T>> {
  return pipe(
      map(diff => {
        switch (diff.type) {
          case 'delete':
            return {
              index: diff.index,
              type: 'delete',
              value: mapFn(diff.value),
            };
          case 'init':
            return {
              type: 'init',
              value: diff.value.map(mapFn),
            };
          case 'insert':
            return {
              index: diff.index,
              type: 'insert',
              value: mapFn(diff.value),
            };
          case 'set':
            return {
              index: diff.index,
              type: 'set',
              value: mapFn(diff.value),
            };
        }
      }),
  );
}

/**
 * Given a sequence of `ArrayDiff`s, rebuild the array.
 *
 * @typeParam T - Type of element in the array.
 * @returns Operator that emits arrays as applied to the input diffs.
 * @thModule rxjs.state
 */
export function scanArray<T>(): OperatorFunction<ArrayDiff<T>, ReadonlyArray<T>> {
  return pipe(
      scan<ArrayDiff<T>, T[]>(
          (acc, diff) => {
            const copy = [...acc];
            switch (diff.type) {
              case 'delete':
                copy.splice(diff.index, 1);

                return copy;
              case 'init':
                return [...diff.value];
              case 'insert':
                copy.splice(diff.index, 0, diff.value);

                return copy;
              case 'set':
                copy[diff.index] = diff.value;

                return copy;
            }
          },
          [],
      ),
  );
}
