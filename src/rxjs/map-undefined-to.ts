import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function mapUndefinedTo<T>(defaultValue: T):
    (source: Observable<T|undefined>) => Observable<T> {
  return source => source.pipe(map(item => item === undefined ? defaultValue : item));
}
