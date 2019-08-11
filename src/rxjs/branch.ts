import { merge, Observable } from '@rxjs';
import { filter } from '@rxjs/operators';

type Operator<A, B> = (obs: Observable<A>) => Observable<B>;

export function branch<V, P extends V, U>(
    conditionFn: (value: V) => value is P,
    passOperator: Operator<P, U>,
    failOperator: Operator<V, U>,
): Operator<V, U>;
export function branch<V, U>(
    conditionFn: (value: V) => boolean,
    passOperator: Operator<V, U>,
    failOperator: Operator<V, U>,
): Operator<V, U>;
export function branch<V, U>(
    conditionFn: (value: V) => boolean,
    passOperator: Operator<V, U>,
    failOperator: Operator<V, U>,
): Operator<V, U> {
  return obs => {
    const pass$ = obs.pipe(
        filter(conditionFn),
        passOperator,
    );
    const fail$ = obs.pipe(
        filter(value => !conditionFn(value)),
        failOperator,
    );
    return merge(pass$, fail$);
  };
}
