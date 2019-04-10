import { Observable, of as observableOf } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { MapSubject } from '../rxjs/map-subject';
import { SetDiff } from '../rxjs/set-observable';
import { getKey } from '../collect/operators/get-key';
import { hasKey } from '../collect/operators/has-key';
import { head } from '../collect/operators/head';
import { keys } from '../collect/operators/keys';
import { pipe } from '../collect/pipe';
import { BaseIdGenerator } from '../random/base-id-generator';
import { EditableStorage } from './editable-storage';

export class InMemoryStorage<T> implements EditableStorage<T> {
  private readonly data: MapSubject<string, T> = new MapSubject();

  constructor(private readonly idGenerator: BaseIdGenerator) { }

  delete(id: string): Observable<unknown> {
    return observableOf({}).pipe(tap(() => this.data.delete(id)));
  }

  generateId(): Observable<string> {
    return this.data.getObs()
        .pipe(
            map(map => this.idGenerator.generate(pipe(map, keys())())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.data.getObs()
        .pipe(
            map(map => pipe(map, hasKey(id))),
            shareReplay(1),
        );
  }

  listIds(): Observable<SetDiff<string>> {
    return this.data.getDiffs()
        .pipe(
            map((diff): SetDiff<string> => {
              switch (diff.type) {
                case 'set':
                  return {value: diff.key, type: 'add'};
                case 'delete':
                  return {value: diff.key, type: 'delete'};
                case 'init':
                  return {payload: new Set(diff.payload.keys()), type: 'init'};
              }
            }),
        );
  }

  read(id: string): Observable<T|null> {
    return this.data.getObs()
        .pipe(
            map(map => {
              const entry = pipe(map, getKey(id), head());

              return entry ? entry[1] : null;
            }),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): Observable<unknown> {
    return observableOf({}).pipe(tap(() => this.data.set(id, instance)));
  }
}
