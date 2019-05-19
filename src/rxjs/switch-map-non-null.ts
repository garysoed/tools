import { Observable, of as observableOf } from '@rxjs';
import { switchMap } from '@rxjs/operators';

export function switchMapNonNull<A, B>(
    fn: (input: Exclude<A, null>) => Observable<B>,
): (source: Observable<A>) => Observable<B|null> {
  return source => source.pipe(
      switchMap(input => (input === null) ? observableOf(null) : fn(input as Exclude<A, null>)),
  );
}
