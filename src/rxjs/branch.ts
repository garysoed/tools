import {of, OperatorFunction, pipe} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export function branch<F, S extends F, T>(
    condition: (target: F) => target is S,
    trueBranch: OperatorFunction<S, T>,
    falseBranch: OperatorFunction<F, T>,
): OperatorFunction<F, T> {
  return pipe(
      switchMap(value => {
        if (condition(value)) {
          return of(value).pipe(trueBranch);
        }

        return of(value).pipe(falseBranch);
      }),
  );
}