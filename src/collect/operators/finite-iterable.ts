/**
 * {@link Iterable}s that are finite but only has one type param.
 *
 * @typeParam T - Type of items in the `Iterable`.
 * @hidden
 */
export type FiniteIterable<T> = ReadonlySet<T> | readonly T[];
