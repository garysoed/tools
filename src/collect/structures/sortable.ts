import { Ordering } from '../compare/ordering';

export interface Sortable<T> {
  sort(ordering: Ordering<T>): void;
}
