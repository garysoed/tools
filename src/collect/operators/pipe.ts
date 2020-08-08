import { Operator } from './operator';

/**
 * Chains together a sequence of `Operator`s to operate on the given `source`.
 *
 * @remarks
 * Use this to chain together the `Operator`s found in this module.
 *
 * @example
 * Increments all items in the array and return it as a `Set`.
 *
 * ```
 * $pipe(
 *   [1, 2, 3, 1],
 *   $map(v => v + 1),
 *   $asSet(),
 * );  // Set([2, 3, 4])
 *
 * @typeParam F - Type of the source.
 * @param source - The starting object.
 * @returns The object returned after a sequence of `Operators` applied on the `source`.
 * @thModule collect.operators
 */
export function $pipe<F>(source: F): F;
export function $pipe<F, T0>(source: F, fn0: Operator<F, T0>): T0;
export function $pipe<F, T0, T1>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
): T1;
export function $pipe<F, T0, T1, T2>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
): T2;
export function $pipe<F, T0, T1, T2, T3>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
    fn3: Operator<T2, T3>,
): T3;
export function $pipe<F, T0, T1, T2, T3, T4>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
    fn3: Operator<T2, T3>,
    fn4: Operator<T3, T4>,
): T4;
export function $pipe<F, T0, T1, T2, T3, T4, T5>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
    fn3: Operator<T2, T3>,
    fn4: Operator<T3, T4>,
    fn5: Operator<T4, T5>,
): T5;
export function $pipe<F, T0, T1, T2, T3, T4, T5, T6>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
    fn3: Operator<T2, T3>,
    fn4: Operator<T3, T4>,
    fn5: Operator<T4, T5>,
    fn6: Operator<T5, T6>,
): T6;
export function $pipe<F, T0, T1, T2, T3, T4, T5, T6, T7>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
    fn3: Operator<T2, T3>,
    fn4: Operator<T3, T4>,
    fn5: Operator<T4, T5>,
    fn6: Operator<T5, T6>,
    fn7: Operator<T6, T7>,
): T7;
export function $pipe<F, T0, T1, T2, T3, T4, T5, T6, T7, T8>(
    source: F,
    fn0: Operator<F, T0>,
    fn1: Operator<T0, T1>,
    fn2: Operator<T1, T2>,
    fn3: Operator<T2, T3>,
    fn4: Operator<T3, T4>,
    fn5: Operator<T4, T5>,
    fn6: Operator<T5, T6>,
    fn7: Operator<T6, T7>,
    fn8: Operator<T7, T8>,
): T8;
export function $pipe<F>(source: F, ...fns: Array<Operator<any, any>>): any {
  let result = source;

  for (const fn of fns) {
    result = fn(result);
  }

  return result;
}
