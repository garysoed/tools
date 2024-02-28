import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export function filterNonNullable<T>(): (
  source: Observable<T>,
) => Observable<NonNullable<T>> {
  return (source) =>
    source.pipe(
      filter(
        (item): item is NonNullable<T> => item !== null && item !== undefined,
      ),
    );
}
