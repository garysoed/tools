import { Observable, of as observableOf } from '@rxjs';
import { map, shareReplay, tap } from '@rxjs/operators';
import { BaseIdGenerator } from '../random/base-id-generator';
import { ArrayDiff, scanArray } from '../rxjs/array-observable';
import { ArraySubject } from '../rxjs/array-subject';
import { scanMap } from '../rxjs/map-observable';
import { MapSubject } from '../rxjs/map-subject';
import { EditableStorage } from './editable-storage';

export class InMemoryStorage<T> implements EditableStorage<T> {
  private readonly arrayData: ArraySubject<string> = new ArraySubject();
  private readonly mapData: MapSubject<string, T> = new MapSubject();

  constructor(private readonly idGenerator: BaseIdGenerator) { }

  clear(): Observable<unknown> {
    return observableOf({})
        .pipe(
            tap(() => {
              this.arrayData.setAll([]);
              this.mapData.setAll(new Map());
            }),
        );
  }

  delete(id: string): Observable<unknown> {
    return observableOf({}).pipe(tap(() => this.mapData.delete(id)));
  }

  deleteAt(index: number): Observable<unknown> {
    return observableOf({})
        .pipe(
            tap(() => this.arrayData.deleteAt(index)),
        );
  }

  findIndex(id: string): Observable<number|null> {
    return this.arrayData.getDiffs()
        .pipe(
            scanArray(),
            map(array => array.findIndex(value => value === id)),
            shareReplay(1),
        );
  }

  generateId(): Observable<string> {
    return this.mapData
        .getDiffs()
        .pipe(
            scanMap(),
            map(map => this.idGenerator.generate(map.keys())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.mapData
        .getDiffs()
        .pipe(
            scanMap(),
            map(map => map.has(id)),
            shareReplay(1),
        );
  }

  insertAt(index: number, id: string, instance: T): Observable<unknown> {
    return observableOf({})
        .pipe(
            tap(() => {
              this.arrayData.insertAt(index, id);
              this.mapData.set(id, instance);
            }),
        );
  }

  listIds(): Observable<ArrayDiff<string>> {
    return this.arrayData.getDiffs();
  }

  read(id: string): Observable<T|null> {
    return this.mapData
        .getDiffs()
        .pipe(
            scanMap(),
            map(map => {
              return map.get(id) || null;
            }),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): Observable<unknown> {
    return observableOf({}).pipe(tap(() => this.mapData.set(id, instance)));
  }

  updateAt(index: number, id: string, instance: T): Observable<unknown> {
    return observableOf({})
        .pipe(
            tap(() => {
              this.arrayData.setAt(index, id);
              this.mapData.set(id, instance);
            }),
        );
  }
}
