import { CompareResult } from './compare-result';

export type Ordering<T> = (item1: T, item2: T) => CompareResult;
