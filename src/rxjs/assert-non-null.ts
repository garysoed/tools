import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function assertNonNull<T>(msg?: string):
    (source: Observable<T>) => Observable<Exclude<T, null>> {
  return source => source.pipe(
      map((item): Exclude<T, null> => {
        if (item === null) {
          throw new Error(msg || `Expected item ${item} to not be null`);
        }

        return item as Exclude<T, null>;
      }),
  );
}
