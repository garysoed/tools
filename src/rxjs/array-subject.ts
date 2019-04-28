import { concat, Observable, of as observableOf, Subject } from '@rxjs';
import { ArrayDiff, ArrayInit, ArrayObservable } from './array-observable';
import { map, shareReplay } from '@rxjs/operators';
import { ImmutableList, createImmutableList } from '../collect/types/immutable-list';


export class ArraySubject<T> implements ArrayObservable<T> {
  private readonly innerArray: T[];
  private readonly diffSubject: Subject<ArrayDiff<T>> = new Subject();

  constructor(init: Iterable<T> = []) {
    this.innerArray = [...init];
  }

  deleteAt(index: number): void {
    if (this.innerArray[index] === undefined) {
      return;
    }

    this.innerArray.splice(index, 1);
    this.diffSubject.next({index, type: 'delete'});
  }

  getDiffs(): Observable<ArrayDiff<T>> {
    return concat(
        observableOf<ArrayInit<T>>({value: [...this.innerArray], type: 'init'}),
        this.diffSubject,
    );
  }

  getObs(): Observable<ImmutableList<T>> {
    return this.diffSubject.pipe(
        map(() => createImmutableList(this.innerArray)),
        shareReplay(1),
    );
  }

  insertAt(index: number, payload: T): void {
    this.innerArray.splice(index, 0, payload);
    this.diffSubject.next({index, value: payload, type: 'insert'});
  }

  setAll(newItems: T[]): void {
    let i = 0;

    // Insert the missing items.
    while (i < newItems.length) {
      const existingItem = this.innerArray[i];
      const newItem = newItems[i];
      if (existingItem !== newItem) {
        this.insertAt(i, newItem);
      }
      i++;
    }

    // Delete the extra items.
    for (let i = this.innerArray.length - 1; i >= newItems.length; i--) {
      this.deleteAt(i);
    }
  }

  setAt(index: number, payload: T): void {
    if (this.innerArray[index] === payload) {
      return;
    }

    this.innerArray[index] = payload;
    this.diffSubject.next({index, value: payload, type: 'set'});
  }
}
