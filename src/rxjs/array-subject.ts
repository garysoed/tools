import { concat, Observable, of as observableOf, Subject } from '@rxjs';
import { ArrayDiff, ArrayInit, ArrayObservable } from './array-observable';
import { diff, applyDiff } from './diff-array';


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

  insert(payload: T): void {
    this.insertAt(this.innerArray.length, payload);
  }

  insertAt(index: number, payload: T): void {
    this.innerArray.splice(index, 0, payload);
    this.diffSubject.next({index, value: payload, type: 'insert'});
  }

  setAll(newItems: T[]): void {
    for (const diffItem of diff(this.innerArray, newItems)) {
      applyDiff(this.innerArray, diffItem);
      this.diffSubject.next(diffItem);
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
