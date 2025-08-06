import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function mapNullableTo<T>(
  defaultValue: T,
): (source: Observable<null | T | undefined>) => Observable<T> {
  return (source) => source.pipe(map((item) => item ?? defaultValue));
}
