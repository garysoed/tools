import {Observable, EMPTY} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {ImmutableResolver, ImmutableResolverInternal} from './resolver';

export function flattenResolver<T>(
    obs: Observable<ImmutableResolver<T>|undefined>,
): ImmutableResolver<T> {
  return new ImmutableResolverInternal(obs.pipe(
      switchMap(state => state ? state : EMPTY),
  ));
}