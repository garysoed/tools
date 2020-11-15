import {CompareResult} from './compare-result';

/**
 * Function that compares two items and returns a comparison result.
 *
 * @typeParam T - Type of items to compare.
 * @returns The comparison result.
 * @hidden
 */
export type Ordering<T> = (item1: T, item2: T) => CompareResult;
