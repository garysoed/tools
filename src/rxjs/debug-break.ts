import {MonoTypeOperatorFunction} from 'rxjs';
import {tap} from 'rxjs/operators';

export function debugBreak<T>(): MonoTypeOperatorFunction<T> {
  return tap(() => {
    // eslint-disable-next-line no-debugger
    debugger;
  });
}