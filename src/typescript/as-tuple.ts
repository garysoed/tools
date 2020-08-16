/**
 * Declares the given array as a tuple.
 *
 * @param v - Tuple to typecast.
 * @returns The input tuple.
 * @thModule typescript
 */
export function asTuple(tuple: []): [];
export function asTuple<T0>(tuple: [T0]): [T0];
export function asTuple<T0, T1>(tuple: [T0, T1]): [T0, T1];
export function asTuple<T extends unknown[]>(tuple: T): T {
  return tuple;
}
