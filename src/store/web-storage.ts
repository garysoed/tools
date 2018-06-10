import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../parse/parser';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { EditableStorage } from './editable-storage';


export class WebStorage<T> implements EditableStorage<T> {
  private readonly idGenerator_: BaseIdGenerator;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
      private readonly storage_: Storage,
      private readonly prefix_: string,
      private readonly parser_: Parser<T>) {
    this.idGenerator_ = new SimpleIdGenerator();
  }

  delete(id: string): Promise<void> {
    const indexes = this.getIndexes_();
    if (!indexes.has(id)) {
      return Promise.reject(new Error(`Index [${id}] does not exist`));
    }
    this.updateIndexes_(indexes.delete(id));
    this.storage_.removeItem(this.getPath_(id));

    return Promise.resolve();
  }

  generateId(): Promise<string> {
    return Promise.resolve(this.idGenerator_.generate([...this.getIndexes_()]));
  }

  /**
   * Returns the indexes in the storage.
   */
  private getIndexes_(): ImmutableSet<string> {
    let indexes = this.storage_.getItem(this.prefix_);
    if (indexes === null) {
      this.updateIndexes_(ImmutableSet.of([]));
      indexes = JSON.stringify([]);
    }

    return ImmutableSet.of(JSON.parse(indexes) as string[]);
  }

  /**
   * @param key Key to base the path from.
   * @return The key with the specified prefix appended.
   */
  private getPath_(key: string): string {
    return `${this.prefix_}/${key}`;
  }

  has(id: string): Promise<boolean> {
    const indexes = this.getIndexes_();

    return Promise.resolve(indexes.has(id));
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
    return Promise.resolve(this.getIndexes_());
  }

  read(id: string): Promise<T | null> {
    const path = this.getPath_(id);

    return new Promise((resolve: (value: T | null) => void, reject: (cause: Error) => void) => {
      try {
        const stringValue = this.storage_.getItem(path);
        if (stringValue === null) {
          resolve(null);
        } else {
          resolve(this.parser_.parse(stringValue));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  update(id: string, instance: T): Promise<void> {
    const path = this.getPath_(id);
    const indexes = this.getIndexes_();
    this.updateIndexes_(indexes.add(id));

    return new Promise<void>((resolve: () => void, reject: (cause: Error) => void) => {
      try {
        this.storage_.setItem(path, this.parser_.stringify(instance));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Updates the indexes with the given values.
   *
   * @param indexes Indexes to update.
   */
  private updateIndexes_(indexes: ImmutableSet<string>): void {
    this.storage_.setItem(this.prefix_, JSON.stringify([...indexes]));
  }
}
