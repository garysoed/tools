import { combineLatest, Observable, of as observableOf } from '@rxjs';
import { take, tap } from '@rxjs/operators';
import { BaseDisposable } from '../dispose/base-disposable';
import { SetDiff } from '../rxjs/set-observable';
import { EditableStorage } from './editable-storage';

export class CachedStorage<T> extends BaseDisposable implements EditableStorage<T> {
  private readonly cache_: Map<string, Observable<T|null>> = new Map();
  private readonly innerStorage_: EditableStorage<T>;

  constructor(innerStorage: EditableStorage<T>) {
    super();
    this.innerStorage_ = innerStorage;
  }

  delete(id: string): Observable<unknown> {
    const item = this.cache_.get(id);
    if (item !== undefined && item instanceof BaseDisposable) {
      item.dispose();
    }

    return this.innerStorage_.delete(id).pipe(tap(() => this.cache_.delete(id)));
  }

  disposeInternal(): void {
    const obsList = [...this.cache_.values()];
    if (obsList.length > 0) {
      combineLatest(obsList)
          .pipe(take(1))
          .subscribe(obs => {
            for (const value of obs) {
              if (value instanceof BaseDisposable) {
                value.dispose();
              }
            }
          });
    }
    super.disposeInternal();
  }

  generateId(): Observable<string> {
    return this.innerStorage_.generateId();
  }

  has(id: string): Observable<boolean> {
    return this.innerStorage_.has(id);
  }

  listIds(): Observable<SetDiff<string>> {
    return this.innerStorage_.listIds();
  }

  read(id: string): Observable<T|null> {
    const cachedObs = this.cache_.get(id);
    if (cachedObs) {
      return cachedObs;
    }

    const obs = this.innerStorage_.read(id);
    this.cache_.set(id, obs);

    return obs;
  }

  update(id: string, instance: T): Observable<unknown> {
    return this.innerStorage_.update(id, instance)
        .pipe(tap(() => this.cache_.set(id, observableOf(instance))));
  }

  /**
   * @param innerStorage The underlying storage.
   * @return New instance of Cached Storage.
   */
  static of<T>(innerStorage: EditableStorage<T>): CachedStorage<T> {
    return new CachedStorage(innerStorage);
  }
}
