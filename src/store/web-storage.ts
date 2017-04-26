import { Arrays } from '../collection/arrays';
import { Sets } from '../collection/sets';
import { Serializer } from '../data/a-serializable';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { Storage as GsStorage } from '../store/interfaces';


export class WebStorage<T> implements GsStorage<T> {
  private readonly idGenerator_: BaseIdGenerator;
  private readonly prefix_: string;
  private readonly storage_: Storage;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(storage: Storage, prefix: string) {
    this.idGenerator_ = new SimpleIdGenerator();
    this.prefix_ = prefix;
    this.storage_ = storage;
  }

  /**
   * Returns the indexes in the storage.
   * @private
   */
  private getIndexes_(): Set<string> {
    let indexes = this.storage_.getItem(this.prefix_);
    if (indexes === null) {
      this.updateIndexes_(new Set());
      indexes = JSON.stringify([]);
    }
    return new Set(<string[]> JSON.parse(indexes));
  }

  /**
   * Updates the indexes with the given values.
   *
   * @param indexes Indexes to update.
   * @private
   */
  private updateIndexes_(indexes: Set<string>): void {
    this.storage_.setItem(this.prefix_, JSON.stringify(Arrays.fromIterable(indexes).asArray()));
  }

  /**
   * @param key Key to base the path from.
   * @return The key with the specified prefix appended.
   */
  private getPath_(key: string): string {
    return `${this.prefix_}/${key}`;
  }

  /**
   * @override
   */
  delete(id: string): Promise<void> {
    let indexes = this.getIndexes_();
    if (!indexes.has(id)) {
      return Promise.reject(new Error(`Index [${id}] does not exist`));
    }
    indexes.delete(id);
    this.updateIndexes_(indexes);
    this.storage_.removeItem(this.getPath_(id));
    return Promise.resolve();
  }

  /**
   * @override
   */
  generateId(): Promise<string> {
    return Promise.resolve(this.idGenerator_.generate(Sets.of(this.getIndexes_()).asArray()));
  }

  /**
   * @override
   */
  has(id: string): Promise<boolean> {
    let indexes = this.getIndexes_();
    return Promise.resolve(indexes.has(id));
  }

  /**
   * @override
   */
  async list(): Promise<T[]> {
    let ids = await this.listIds();
    let promises = Arrays
        .fromIterable(ids)
        .map((id: string) => {
          return this.read(id);
        })
        .asArray();
    let items = await Promise.all(promises);
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
    return Promise.resolve(this.getIndexes_());
  }

  /**
   * @override
   */
  read(id: string): Promise<T | null> {
    let path = this.getPath_(id);
    return new Promise((resolve: (value: T | null) => void, reject: (cause: Error) => void) => {
      try {
        let stringValue = this.storage_.getItem(path);
        if (stringValue === null) {
          resolve(null);
        } else {
          let json = JSON.parse(stringValue);
          resolve(Serializer.fromJSON(json));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @override
   */
  update(id: string, instance: T): Promise<void> {
    let path = this.getPath_(id);
    let indexes = this.getIndexes_();
    indexes.add(id);
    this.updateIndexes_(indexes);

    return new Promise((resolve: () => void, reject: (cause: Error) => void) => {
      try {
        let json = Serializer.toJSON(instance);
        this.storage_.setItem(path, JSON.stringify(json));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
