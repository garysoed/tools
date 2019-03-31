import { concat, Observable, of as observableOf, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

export interface ArrayInit<T> {
  payload: T[];
  type: 'init';
}

export interface ArrayInsert<T> {
  index: number;
  payload: T;
  type: 'insert';
}

export interface ArrayDelete {
  index: number;
  type: 'delete';
}

export interface ArraySet<T> {
  index: number;
  payload: T;
  type: 'set';
}

export type ArrayDiff<T> = ArrayInit<T>|ArrayInsert<T>|ArrayDelete|ArraySet<T>;

export class ArraySubject<T> {
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
        observableOf<ArrayInit<T>>({payload: [...this.innerArray], type: 'init'}),
        this.diffSubject,
    );
  }

  getObs(): Observable<T[]> {
    return this.diffSubject.pipe(mapTo(this.innerArray));
  }

  insertAt(index: number, payload: T): void {
    this.innerArray.splice(index, 0, payload);
    this.diffSubject.next({index, payload, type: 'insert'});
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
    this.diffSubject.next({index, payload, type: 'set'});
  }
}
