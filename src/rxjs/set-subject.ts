import { concat, Observable, of as observableOf, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ImmutableSet, createImmutableSet } from '../collect/types/immutable-set';
import { SetDiff, SetInit, SetObservable } from './set-observable';

export class SetSubject<T> implements SetObservable<T> {
  private readonly innerSet: Set<T>;
  private readonly diffSubject: Subject<SetDiff<T>> = new Subject();

  constructor(init: Iterable<T> = []) {
    this.innerSet = new Set([...init]);
  }

  add(value: T): void {
    if (this.innerSet.has(value)) {
      return;
    }

    this.innerSet.add(value);
    this.diffSubject.next({value, type: 'add'});
  }

  delete(value: T): void {
    if (!this.innerSet.has(value)) {
      return;
    }

    this.innerSet.delete(value);
    this.diffSubject.next({value, type: 'delete'});
  }

  getDiffs(): Observable<SetDiff<T>> {
    return concat(
        observableOf<SetInit<T>>({payload: new Set([...this.innerSet]), type: 'init'}),
        this.diffSubject,
    );
  }

  getObs(): Observable<ImmutableSet<T>> {
    return this.diffSubject.pipe(
        map(() => createImmutableSet(this.innerSet)),
        shareReplay(1),
    );
  }

  setAll(newItems: Set<T>): void {
    // Delete the extra items.
    for (const existingValue of this.innerSet) {
      if (!newItems.has(existingValue)) {
        this.delete(existingValue);
      }
    }

    // Insert the missing items.
    for (const newValue of newItems) {
      if (!this.innerSet.has(newValue)) {
        this.add(newValue);
      }
    }
  }
}
