import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function mapNonNull<A, B>(fn: (from: A) => B):
    (source: Observable<A|null>) => Observable<B|null> {
  return source => source.pipe(
      map(item => item === null ? null : fn(item)),
  );
}
