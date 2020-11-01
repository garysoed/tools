import { OperatorFunction, of as observableOf, pipe } from 'rxjs';
import { map, pairwise, scan, startWith, switchMap } from 'rxjs/operators';

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
 * @thModule rxjs.state
 */
export function diffSet<T>(): OperatorFunction<ReadonlySet<T>, SetDiff<T>> {
  return pipe(
      startWith(new Set<T>()),
      pairwise(),
      map(([oldSet, newSet]) => {
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
      }),
      switchMap(diffs => observableOf(...diffs)),
  );
}

/**
 * Maps the value of the set diffs.
 *
 * @typeParam F - Original type of the set.
 * @typeParam T - Destination type of the set.
 * @param mapFn - Map function to apply.
 * @returns Operator that maps the values of any input set diff using the given mapping function.
 *
 * @thModule rxjs.state
 */
export function mapSetDiff<F, T>(mapFn: (value: F) => T): OperatorFunction<SetDiff<F>, SetDiff<T>> {
  return pipe(
      map(diff => {
        switch (diff.type) {
          case 'add':
            return {type: 'add', value: mapFn(diff.value)};
          case 'init':
            return {type: 'init', value: new Set([...diff.value].map(v => mapFn(v)))};
          case 'delete':
            return {type: 'delete', value: mapFn(diff.value)};
        }
      }),
  );
}

/**
 * Given a sequence of `SetDiff`s, rebuild the set.
 *
 * @typeParam T - Type of element in the set.
 * @returns Operator that emits sets as applied to the input diffs.
 * @thModule rxjs.state
 */
export function scanSet<T>(): OperatorFunction<SetDiff<T>, ReadonlySet<T>> {
  return pipe(
      scan<SetDiff<T>, Set<T>>(
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
          new Set(),
      ),
  );
}
