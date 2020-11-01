import { Observable } from 'rxjs';
import { Type } from 'gs-types';
import { filter } from 'rxjs/operators';

export function filterByType<F, T extends F>(
    type: Type<T>,
): (source: Observable<F>) => Observable<T> {
  return source => source.pipe(filter((item): item is T => type.check(item)));
}
