import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { setKey } from 'src/collect/operators/set-key';
import { exec } from '../collect/exec';
import { deleteKey } from '../collect/operators/delete-key';
import { getKey } from '../collect/operators/get-key';
import { hasKey } from '../collect/operators/has-key';
import { head } from '../collect/operators/head';
import { keys } from '../collect/operators/keys';
import { asImmutableMap, createImmutableMap, ImmutableMap } from '../collect/types/immutable-map';
import { asImmutableSet, ImmutableSet } from '../collect/types/immutable-set';
import { BaseIdGenerator } from '../random/base-id-generator';
import { EditableStorage } from './editable-storage';

export class InMemoryStorage<T> implements EditableStorage<T> {
  // TODO: Build the map from diffs.
  private readonly data: BehaviorSubject<ImmutableMap<string, T>> =
      new BehaviorSubject(createImmutableMap());

  constructor(private readonly idGenerator: BaseIdGenerator) { }

  delete(id: string): void {
    this.data.next(
        exec(
            this.data.getValue(),
            deleteKey(id),
            asImmutableMap(),
        ),
    );
  }

  generateId(): Observable<string> {
    return this.data
        .pipe(
            map(map => this.idGenerator.generate(exec(map, keys())())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.data
        .pipe(
            map(map => exec(map, hasKey(id))),
            shareReplay(1),
        );
  }

  listIds(): Observable<ImmutableSet<string>> {
    return this.data
        .pipe(
            map(map => exec(
                map,
                keys(),
                asImmutableSet(),
            )),
            shareReplay(1),
        );
  }

  read(id: string): Observable<T|null> {
    return this.data
        .pipe(
            map(map => {
              const entry = exec(map, getKey(id), head());

              return entry ? entry[1] : null;
            }),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): void {
    this.data.next(
        exec(
            this.data.getValue(),
            setKey([id, [id, instance] as [string, T]]),
            asImmutableMap(),
        ),
    );
  }
}
