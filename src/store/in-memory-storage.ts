import { BehaviorSubject, defer, Observable, of as observableOf } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { BaseIdGenerator } from '../random/base-id-generator';
import { ArrayDiff } from '../rxjs/state/array-observable';
import { diffArray } from '../rxjs/state/diff-array';

import { EditableStorage } from './editable-storage';


export class InMemoryStorage<T> implements EditableStorage<T> {
  private readonly arrayData$ = new BehaviorSubject<readonly string[]>([]);
  private readonly mapData$ = new BehaviorSubject<ReadonlyMap<string, T>>(new Map());

  constructor(private readonly idGenerator: BaseIdGenerator) { }

  clear(): Observable<unknown> {
    return observableOf({})
        .pipe(
            tap(() => {
              this.arrayData$.next([]);
              this.mapData$.next(new Map());
            }),
        );
  }

  delete(id: string): Observable<unknown> {
    return defer(() => {
      const array = this.arrayData$.getValue();
      const map = new Map(this.mapData$.getValue());

      const filteredArray = array.filter(v => v !== id);
      this.arrayData$.next(filteredArray);

      map.delete(id);
      this.mapData$.next(map);
      return observableOf({});
    });
  }

  deleteAt(index: number): Observable<unknown> {
    return defer(() => {
      const array = [...this.arrayData$.getValue()];
      const map = new Map(this.mapData$.getValue());

      const [key] = array.splice(index, 1);
      this.arrayData$.next(array);

      if (key) {
        map.delete(key);
        this.mapData$.next(map);
      }
      return observableOf({});
    });
  }

  findIndex(id: string): Observable<number|null> {
    return this.arrayData$
        .pipe(
            map(array => array.findIndex(value => value === id)),
            shareReplay(1),
        );
  }

  generateId(): Observable<string> {
    return this.mapData$
        .pipe(
            map(map => this.idGenerator.generate(map.keys())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.mapData$
        .pipe(
            map(map => map.has(id)),
            shareReplay(1),
        );
  }

  insertAt(index: number, id: string, instance: T): Observable<unknown> {
    return defer(() => {
      const array = [...this.arrayData$.getValue()];
      const map = new Map(this.mapData$.getValue());

      array.splice(index, 0, id);
      this.arrayData$.next(array);

      map.set(id, instance);
      this.mapData$.next(map);

      return observableOf({});
    });
  }

  listIds(): Observable<ArrayDiff<string>> {
    return this.arrayData$.pipe(diffArray());
  }

  read(id: string): Observable<T|null> {
    return this.mapData$
        .pipe(
            map(map => map.get(id) || null),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): Observable<unknown> {
    return defer(() => {
      const array = [...this.arrayData$.getValue()];
      const map = new Map(this.mapData$.getValue());

      if (map.has(id)) {
        return observableOf({});
      }

      map.set(id, instance);
      this.mapData$.next(map);

      array.push(id);
      this.arrayData$.next(array);
      return observableOf({});
    });
  }

  updateAt(index: number, id: string, instance: T): Observable<unknown> {
    return defer(() => {
      const array = [...this.arrayData$.getValue()];
      const map = new Map(this.mapData$.getValue());

      if (map.has(id)) {
        return observableOf({});
      }

      map.set(id, instance);
      this.mapData$.next(map);

      array.splice(index, 0, id);
      this.arrayData$.next(array);
      return observableOf({});
    });
  }
}
