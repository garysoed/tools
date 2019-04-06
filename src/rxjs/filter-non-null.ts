import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function filterNonNull<T>(): (source: Observable<T>) => Observable<Exclude<T, null>> {
  return source => source.pipe(
      filter((item): item is Exclude<T, null> => item !== null),
  );
}
