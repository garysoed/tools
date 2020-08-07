/**
 * Result of comparison.
 *
 * @remarks
 * If `-1`, the first item is smaller than the second. If `1`, the first item is larger than the
 * second. Otherwise, no comparison is done. The two items are either equal or uncomparable.
 *
 * @hidden
 */
export type CompareResult = -1 | 0 | 1;
