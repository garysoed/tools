import {OperatorFunction, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

export function forwardTo<T>(subject: Subject<T>): OperatorFunction<T, T> {
  return tap((value) => subject.next(value));
}
