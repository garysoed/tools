import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';

import { EditableStorage } from './editable-storage';


export class InMemoryStorage<T> implements EditableStorage<T> {
  private readonly data$ = new BehaviorSubject<ReadonlyMap<string, T>>(new Map());

  constructor(
      private readonly idGenerator: BaseIdGenerator = new SimpleIdGenerator(),
  ) { }

  add(instance: T): string {
    const data = this.data$.getValue();
    const newId = this.idGenerator.generate([...data.keys()]);
    this.data$.next(new Map([...data, [newId, instance]]));
    return newId;
  }

  clear(): void {
    return this.data$.next(new Map());
  }

  delete(id: string): boolean {
    const data = this.data$.getValue();
    if (!data.has(id)) {
      return false;
    }

    const newData = new Map(data);
    newData.delete(id);
    this.data$.next(newData);
    return true;
  }

  has(id: string): Observable<boolean> {
    return this.data$.pipe(map(map => map.has(id)));
  }

  get idList$(): Observable<ReadonlySet<string>> {
    return this.data$.pipe(map(data => new Set(data.keys())));
  }

  read(id: string): Observable<T|undefined> {
    return this.data$.pipe(map(map => map.get(id) ?? undefined));
  }

  update(id: string, instance: T): boolean {
    const data = this.data$.getValue();
    if (!data.has(id)) {
      return false;
    }

    const newData = new Map(data);
    newData.set(id, instance);
    this.data$.next(newData);
    return true;
  }
}
