import { BaseDisposable } from '../dispose/base-disposable';
import { ImmutableSet } from '../immutable';
import { EditableStorage } from './editable-storage';

export class CachedStorage<T> extends BaseDisposable implements EditableStorage<T> {
  private readonly cache_: Map<string, T>;
  private readonly innerStorage_: EditableStorage<T>;

  constructor(innerStorage: EditableStorage<T>) {
    super();
    this.cache_ = new Map<string, T>();
    this.innerStorage_ = innerStorage;
  }

  delete(id: string): Promise<void> {
    const item = this.cache_.get(id);
    if (item !== undefined && item instanceof BaseDisposable) {
      item.dispose();
    }
    this.cache_.delete(id);

    return this.innerStorage_.delete(id);
  }

  disposeInternal(): void {
    this.cache_
        .forEach((value: T) => {
          if (value instanceof BaseDisposable) {
            value.dispose();
          }
        });
    super.disposeInternal();
  }

  generateId(): Promise<string> {
    return this.innerStorage_.generateId();
  }

  has(id: string): Promise<boolean> {
    return this.innerStorage_.has(id);
  }

  async list(): Promise<ImmutableSet<T>> {
    const ids = await this.listIds();
    const promises = ids
        .mapItem((id: string) => {
          return this.read(id);
        });
    const items = await Promise.all([...promises]);

    return ImmutableSet
        .of(items)
        .filterItem((item: T | null) => {
          return item !== null;
        }) as ImmutableSet<T>;
  }

  listIds(): Promise<ImmutableSet<string>> {
    return this.innerStorage_.listIds();
  }

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

  async update(id: string, instance: T): Promise<void> {
    await this.innerStorage_.update(id, instance);
    this.cache_.set(id, instance);
  }

  /**
   * @param innerStorage The underlying storage.
   * @return New instance of Cached Storage.
   */
  static of<T>(innerStorage: EditableStorage<T>): CachedStorage<T> {
    return new CachedStorage(innerStorage);
  }
}
