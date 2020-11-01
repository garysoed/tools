import { Observable } from 'rxjs';
import { Type } from 'gs-types';
import { map } from 'rxjs/operators';

export function assertByType<T>(type: Type<T>): (source: Observable<unknown>) => Observable<T> {
  return source => source.pipe(
      map(value => {
        type.assert(value);
        return value;
      }),
  );
}
