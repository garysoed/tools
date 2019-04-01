import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export class WebStorageObservable {
  private readonly invalidateSubject: Subject<void> = new Subject();

  constructor(private readonly storage: Storage) { }

  private getInvalidateObs(): Observable<unknown> {
    return merge(this.invalidateSubject, fromEvent(window, 'storage'));
  }

  getLength(): Observable<number> {
    return this.getInvalidateObs()
        .pipe(
            startWith({}),
            map(() => this.storage.length),
        );
  }

  getItem(key: string): Observable<string|null> {
    return this.getInvalidateObs()
        .pipe(
            startWith({}),
            map(() => this.storage.getItem(key)),
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
