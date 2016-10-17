import {Serializer} from '../data/a-serializable';
import {Storage as GsStorage} from './interfaces';


export class WebStorage<T> implements GsStorage<T> {
  private prefix_: string;
  private storage_: Storage;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(storage: Storage, prefix: string) {
    this.prefix_ = prefix;
    this.storage_ = storage;
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
    return this.update(id, instance);
  }

  /**
   * @override
   */
  delete(id: string): Promise<void> {
    this.storage_.removeItem(this.getPath_(id));
    return Promise.resolve();
  }

  /**
   * @override
   */
  has(id: string): Promise<boolean> {
    return Promise.resolve(this.storage_.getItem(this.getPath_(id)) !== null);
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
