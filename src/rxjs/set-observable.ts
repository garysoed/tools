import { Observable } from 'rxjs';
import { ImmutableSet } from '../collect/types/immutable-set';

export interface SetAdd<T> {
  type: 'add';
  value: T;
}

export interface SetInit<T> {
  payload: Set<T>;
  type: 'init';
}

export interface SetDelete<T> {
  type: 'delete';
  value: T;
}

export type SetDiff<T> = SetInit<T>|SetDelete<T>|SetAdd<T>;

export interface SetObservable<T> {
  getDiffs(): Observable<SetDiff<T>>;

  getObs(): Observable<ImmutableSet<T>>;
}
