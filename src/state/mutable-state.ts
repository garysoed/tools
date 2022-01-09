import {hasPropertiesType, instanceofType} from 'gs-types';
import {BehaviorSubject, Observable} from 'rxjs';

export interface MutableState<T> {
  value$: Observable<T>;
  set(newValue: T): void;
}

export const MUTABLE_STATE_TYPE = hasPropertiesType({
  value$: instanceofType(Observable),
  set: instanceofType(Function),
});

export function mutableState<T>(value: T): MutableState<T> {
  const value$ = new BehaviorSubject(value);
  return {
    value$,
    set(value: T): void {
      value$.next(value);
    },
  };
}
