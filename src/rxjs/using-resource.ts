import { Observable, Unsubscribable, using } from 'rxjs';

interface Resource<R> extends Unsubscribable {
  readonly resource: R;
}

export function usingResource<R, T>(
    resourceFactory: () => Resource<R>,
    observableFactory: (resource: R) => Observable<T>,
): Observable<T> {
  return using(
      () => resourceFactory(),
      unsubscribable => observableFactory((unsubscribable as unknown as Resource<R>).resource),
  );
}
