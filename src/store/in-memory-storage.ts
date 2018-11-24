import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ImmutableMap, ImmutableSet } from '../immutable';
import { BaseIdGenerator } from '../random/base-id-generator';
import { EditableStorage } from './editable-storage';

export class InMemoryStorage<T> implements EditableStorage<T> {
  private readonly data_: BehaviorSubject<ImmutableMap<string, T>> =
      new BehaviorSubject(ImmutableMap.of());

  constructor(private readonly idGenerator_: BaseIdGenerator) { }

  delete(id: string): void {
    this.data_.next(this.data_.getValue().deleteKey(id));
  }

  generateId(): Observable<string> {
    return this.data_
        .pipe(
            map(map => this.idGenerator_.generate(map.keys())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.data_
        .pipe(
            map(map => map.hasKey(id)),
            shareReplay(1),
        );
  }

  listIds(): Observable<ImmutableSet<string>> {
    return this.data_
        .pipe(
            map(map => map.keys()),
            shareReplay(1),
        );
  }

  read(id: string): Observable<T|null> {
    return this.data_
        .pipe(
            map(map => {
              return map.get(id) || null;
            }),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): void {
    this.data_.next(this.data_.getValue().set(id, instance));
  }
}
