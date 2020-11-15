import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export function filterDefined<T>(): (source: Observable<T>) => Observable<Exclude<T, undefined>> {
  return source => source.pipe(
      filter((item): item is Exclude<T, undefined> => item !== undefined),
  );
}
