import { BaseDisposable } from '../dispose/base-disposable';

import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
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
    this.cache_
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
  async list(): Promise<ImmutableSet<T>> {
    const ids = await this.listIds();
    const promises = ids
        .mapItem((id: string) => {
          return this.read(id);
        });
    const items = await Promise.all(Iterables.toArray(promises));
    return ImmutableSet
        .of(items)
        .filterItem((item: T | null) => {
          return item !== null;
        }) as ImmutableSet<T>;
  }

  /**
   * @override
   */
  listIds(): Promise<ImmutableSet<string>> {
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
