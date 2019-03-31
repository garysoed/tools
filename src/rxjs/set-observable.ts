import { Observable } from 'rxjs';
import { ImmutableSet } from '../collect/types/immutable-set';

export interface SetAdd<T> {
  value: T;
  type: 'add';
}

export interface SetInit<T> {
  payload: Set<T>;
  type: 'init';
}

export interface SetDelete<T> {
  value: T;
  type: 'delete';
}

export type SetDiff<T> = SetInit<T>|SetDelete<T>|SetAdd<T>;

export interface SetObservable<T> {
  getDiffs(): Observable<SetDiff<T>>;

  getObs(): Observable<ImmutableSet<T>>;
}
