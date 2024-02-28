import {MonoTypeOperatorFunction} from 'rxjs';
import {tap} from 'rxjs/operators';

type CheckFn<T> = (value: T) => boolean;

export function debugBreak<T>(
  checkFn: CheckFn<T> = () => true,
): MonoTypeOperatorFunction<T> {
  return tap((value) => {
    if (!checkFn(value)) {
      return;
    }
    // eslint-disable-next-line no-debugger
    debugger;
  });
}
