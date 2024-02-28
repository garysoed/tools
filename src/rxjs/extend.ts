import {OperatorFunction, pipe} from 'rxjs';
import {map} from 'rxjs/operators';

export function extend<F, T>(value: T): OperatorFunction<F, T> {
  return pipe(map((fromValue) => ({...value, ...fromValue})));
}
