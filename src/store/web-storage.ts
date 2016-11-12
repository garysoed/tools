import {Serializer} from '../data/a-serializable';
import {Storage as GsStorage} from './interfaces';
import {Validate} from '../valid/validate';


export class WebStorage<T> implements GsStorage<T> {
  private readonly prefix_: string;
  private readonly storage_: Storage;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(storage: Storage, prefix: string) {
    this.prefix_ = prefix;
    this.storage_ = storage;
  }

  /**
   * Returns the indexes in the storage.
   * @private
   */
  private getIndexes_(): string[] {
    let indexes = this.storage_.getItem(this.prefix_);
    if (indexes === null) {
      this.updateIndexes_([]);
    }
    return JSON.parse(this.storage_.getItem(this.prefix_));
  }

  /**
   * Updates the indexes with the given values.
   *
   * @param indexes Indexes to update.
   * @private
   */
  private updateIndexes_(indexes: string[]): void {
    this.storage_.setItem(this.prefix_, JSON.stringify(indexes));
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
  create(id: string, instance: T): Promise<void> {
    let indexes = this.getIndexes_();
    if (!Validate.array(indexes).toNot.contain(id).isValid()) {
      // TODO: Make custom error thrower that surrounds values with '[]'
      return Promise.reject(new Error(`Index [${id}] already exist`));
    }
    indexes.push(id);
    this.updateIndexes_(indexes);
    return this.update(id, instance);
  }

  /**
   * @override
   */
  delete(id: string): Promise<void> {
    let indexes = this.getIndexes_();
    if (!Validate.array(indexes).to.contain(id).isValid()) {
      return Promise.reject(new Error(`Index [${id}] does not exist`));
    }
    indexes.splice(indexes.indexOf(id), 1);
    this.updateIndexes_(indexes);
    this.storage_.removeItem(this.getPath_(id));
    return Promise.resolve();
  }

  /**
   * @override
   */
  has(id: string): Promise<boolean> {
    let indexes = this.getIndexes_();
    return Promise.resolve(indexes.indexOf(id) >= 0);
  }

  /**
   * @override
   */
  list(): Promise<string[]> {
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
        }

        let json = JSON.parse(stringValue);
        resolve(Serializer.fromJSON(json));
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
