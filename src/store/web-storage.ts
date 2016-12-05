import {Arrays} from '../collection/arrays';
import {IdGenerator, Storage as GsStorage} from './interfaces';
import {Serializer} from '../data/a-serializable';
import {SimpleIdGenerator} from './simple-id-generator';
import {Validate} from '../valid/validate';


export class WebStorage<T> implements GsStorage<T> {
  private readonly idGenerator_: IdGenerator;
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
    if (!Validate.set(indexes).to.contain(id).isValid()) {
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
  has(id: string): Promise<boolean> {
    let indexes = this.getIndexes_();
    return Promise.resolve(indexes.has(id));
  }

  /**
   * @override
   */
  list(): Promise<Set<string>> {
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
  reserve(): Promise<string> {
    let id = this.idGenerator_.generate();
    let indexes = new Set(this.getIndexes_());
    while (indexes.has(id)) {
      id = this.idGenerator_.resolveConflict(id);
    }
    return Promise.resolve(id);
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
