import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { setKey } from 'src/collect/operators/set-key';
import { ImmutableMap } from '../collect/immutable-map';
import { ImmutableSet } from '../collect/immutable-set';
import { deleteKey } from '../collect/operators/delete-key';
import { getKey } from '../collect/operators/get-key';
import { hasKey } from '../collect/operators/has-key';
import { head } from '../collect/operators/head';
import { keys } from '../collect/operators/keys';
import { BaseIdGenerator } from '../random/base-id-generator';
import { EditableStorage } from './editable-storage';

export class InMemoryStorage<T> implements EditableStorage<T> {
  // TODO: Build the map from diffs.
  private readonly data: BehaviorSubject<ImmutableMap<string, T>> =
      new BehaviorSubject(ImmutableMap.of());

  constructor(private readonly idGenerator: BaseIdGenerator) { }

  delete(id: string): void {
    this.data.next(
        this.data.getValue().$(
            deleteKey(id),
            ImmutableMap.create(),
        ),
    );
  }

  generateId(): Observable<string> {
    return this.data
        .pipe(
            map(map => this.idGenerator.generate(map.$(keys())())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.data
        .pipe(
            map(map => map.$(hasKey(id))),
            shareReplay(1),
        );
  }

  listIds(): Observable<ImmutableSet<string>> {
    return this.data
        .pipe(
            map(map => map
                .$(
                    keys(),
                    ImmutableSet.create(),
                ),
            ),
            shareReplay(1),
        );
  }

  read(id: string): Observable<T|null> {
    return this.data
        .pipe(
            map(map => {
              const entry = map.$(getKey(id), head());

              return entry ? entry[1] : null;
            }),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): void {
    this.data.next(
        this.data.getValue().$(
            setKey([id, [id, instance] as [string, T]]),
            ImmutableMap.create(),
        ),
    );
  }
}
