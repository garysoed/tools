import { Arrays } from '../collection/arrays';
import { Maps } from '../collection/maps';
import { Sets } from '../collection/sets';
import { BaseDisposable } from '../dispose/base-disposable';

import { Storage } from './interfaces';


export class CachedStorage<T> extends BaseDisposable implements Storage<T> {
  private readonly cache_: Map<string, T>;
  private readonly innerStorage_: Storage<T>;

  constructor(innerStorage: Storage<T>) {
    super();
    this.cache_ = new Map<string, T>();
    this.innerStorage_ = innerStorage;
  }

  /**
   * @override
   */
  delete(id: string): Promise<void> {
    const item = this.cache_.get(id);
    if (item !== undefined && item instanceof BaseDisposable) {
      item.dispose();
    }
    this.cache_.delete(id);
    return this.innerStorage_.delete(id);
  }

  /**
   * @override
   */
  disposeInternal(): void {
    Maps
        .of(this.cache_)
        .forEach((value: T) => {
          if (value instanceof BaseDisposable) {
            value.dispose();
          }
        });
    super.disposeInternal();
  }

  /**
   * @override
   */
  generateId(): Promise<string> {
    return this.innerStorage_.generateId();
  }

  /**
   * @override
   */
  has(id: string): Promise<boolean> {
    return this.innerStorage_.has(id);
  }

  /**
   * @override
   */
  async list(): Promise<T[]> {
    const ids = await this.listIds();
    const promises = Sets
        .of(ids)
        .map((id: string) => {
          return this.read(id);
        })
        .asArray();
    const items = await Promise.all(promises);
    return Arrays
        .of(items)
        .filter((item: T | null) => {
          return item !== null;
        })
        .castElements<T>()
        .asArray();
  }

  /**
   * @override
   */
  listIds(): Promise<Set<string>> {
    return this.innerStorage_.listIds();
  }

  /**
   * @override
   */
  async read(id: string): Promise<T | null> {
    if (this.cache_.has(id)) {
      return this.cache_.get(id) || null;
    }

    const item = await this.innerStorage_.read(id);
    if (item !== null) {
      this.cache_.set(id, item);
    }
    return item;
  }

  /**
   * @override
   */
  async update(id: string, instance: T): Promise<void> {
    await this.innerStorage_.update(id, instance);
    this.cache_.set(id, instance);
  }

  /**
   * @param innerStorage The underlying storage.
   * @return New instance of Cached Storage.
   */
  static of<T>(innerStorage: Storage<T>): CachedStorage<T> {
    return new CachedStorage(innerStorage);
  }
}
// TODO: Mutable
