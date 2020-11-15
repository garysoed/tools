import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function assertDefined<T>(msg?: string):
    (source: Observable<T>) => Observable<Exclude<T, undefined>> {
  return source => source.pipe(
      map((item): Exclude<T, undefined> => {
        if (item === undefined) {
          throw new Error(msg || `Expected item ${item} to be defined`);
        }

        return item as Exclude<T, undefined>;
      }),
  );
}
