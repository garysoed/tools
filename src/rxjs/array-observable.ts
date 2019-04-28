import { Observable } from '@rxjs';

export interface ArrayInit<T> {
  value: T[];
  type: 'init';
}

export interface ArrayInsert<T> {
  index: number;
  value: T;
  type: 'insert';
}

export interface ArrayDelete {
  index: number;
  type: 'delete';
}

export interface ArraySet<T> {
  index: number;
  value: T;
  type: 'set';
}

export type ArrayDiff<T> = ArrayInit<T>|ArrayInsert<T>|ArrayDelete|ArraySet<T>;

export interface ArrayObservable<T> {
  getDiffs(): Observable<ArrayDiff<T>>;
}
