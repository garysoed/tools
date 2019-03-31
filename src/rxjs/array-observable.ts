import { Observable } from 'rxjs';
import { ImmutableList } from '../collect/types/immutable-list';

export interface ArrayInit<T> {
  payload: T[];
  type: 'init';
}

export interface ArrayInsert<T> {
  index: number;
  payload: T;
  type: 'insert';
}

export interface ArrayDelete {
  index: number;
  type: 'delete';
}

export interface ArraySet<T> {
  index: number;
  payload: T;
  type: 'set';
}

export type ArrayDiff<T> = ArrayInit<T>|ArrayInsert<T>|ArrayDelete|ArraySet<T>;

export interface ArrayObservable<T> {
  getDiffs(): Observable<ArrayDiff<T>>;

  getObs(): Observable<ImmutableList<T>>;
}
