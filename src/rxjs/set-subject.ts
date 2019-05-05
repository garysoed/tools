import { concat, Observable, of as observableOf, Subject } from '@rxjs';
import { applyDiff, diff } from './diff-set';
import { SetDiff, SetInit, SetObservable } from './set-observable';

export class SetSubject<T> implements SetObservable<T> {
  private readonly diffSubject: Subject<SetDiff<T>> = new Subject();
  private readonly innerSet: Set<T>;

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
        observableOf<SetInit<T>>({value: new Set([...this.innerSet]), type: 'init'}),
        this.diffSubject,
    );
  }

  setAll(newItems: Set<T>): void {
    for (const diffItem of diff(this.innerSet, newItems)) {
      applyDiff(this.innerSet, diffItem);
      this.diffSubject.next(diffItem);
    }
  }
}
