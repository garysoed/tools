import { defer, fromEvent, merge, Observable, of as observableOf, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

export class WebStorageObservable {
  private readonly onInvalidatedLocally$: Subject<void> = new Subject();

  constructor(private readonly storage: Storage) { }

  clear(): Observable<unknown> {
    return defer(() => {
      this.storage.clear();
      return observableOf({});
    });
  }

  getItem(key: string): Observable<string|null> {
    return this.onInvalidate$
        .pipe(
            startWith({}),
            map(() => this.storage.getItem(key)),
        );
  }

  getLength(): Observable<number> {
    return this.onInvalidate$
        .pipe(
            startWith({}),
            map(() => this.storage.length),
        );
  }

  key(index: number): Observable<string|null> {
    return this.onInvalidate$
        .pipe(
            startWith({}),
            map(() => this.storage.key(index)),
        );
  }

  removeItem(key: string): Observable<unknown> {
    return defer(() => {
      this.storage.removeItem(key);
      this.onInvalidatedLocally$.next();
      return observableOf({});
    });
  }

  setItem(key: string, value: string): Observable<unknown> {
    return defer(() => {
      this.storage.setItem(key, value);
      this.onInvalidatedLocally$.next();
      return observableOf({});
    });
  }

  private get onInvalidate$(): Observable<unknown> {
    return merge(this.onInvalidatedLocally$, fromEvent(window, 'storage'));
  }
}
