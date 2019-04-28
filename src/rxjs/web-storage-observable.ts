import { fromEvent, merge, Observable, Subject } from '@rxjs';
import { map, startWith } from '@rxjs/operators';

export class WebStorageObservable {
  private readonly invalidateSubject: Subject<void> = new Subject();

  constructor(private readonly storage: Storage) { }

  private getInvalidateObs(): Observable<unknown> {
    return merge(this.invalidateSubject, fromEvent(window, 'storage'));
  }

  getItem(key: string): Observable<string|null> {
    return this.getInvalidateObs()
        .pipe(
            startWith({}),
            map(() => this.storage.getItem(key)),
        );
  }

  getLength(): Observable<number> {
    return this.getInvalidateObs()
        .pipe(
            startWith({}),
            map(() => this.storage.length),
        );
  }

  key(index: number): Observable<string|null> {
    return this.getInvalidateObs()
        .pipe(
            startWith({}),
            map(() => this.storage.key(index)),
        );
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
    this.invalidateSubject.next();
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
    this.invalidateSubject.next();
  }
}
