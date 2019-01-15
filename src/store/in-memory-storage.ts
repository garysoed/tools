import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ImmutableMap } from '../collect/immutable-map';
import { deleteKey } from '../collect/operators/delete-key';
import { hasKey } from '../collect/operators/has-key';
import { ImmutableSet } from '../immutable';
import { BaseIdGenerator } from '../random/base-id-generator';
import { EditableStorage } from './editable-storage';
import { keys } from '../collect/operators/keys';

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
            map(map => this.idGenerator.generate(map.keys())),
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
                )
            ),
            shareReplay(1),
        );
  }

  read(id: string): Observable<T|null> {
    return this.data
        .pipe(
            map(map => {
              return map.get(id) || null;
            }),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): void {
    this.data.next(this.data.getValue().set(id, instance));
  }
}
