import { ImmutableSet } from '../immutable/immutable-set';

export interface ReadableStorage<TFull, TSummary = TFull> {
  /**
   * Checks if the object corresponding to the given ID exists in the storage.
   *
   * @param id ID of the object to be checked.
   * @return Promise that will be resolved with true iff the object exists in the storage.
   */
  has(id: string): Promise<boolean>;

  /**
   * @return Array of data in the storage.
   */
  list(): Promise<ImmutableSet<TSummary>>;

  /**
   * @return IDs of the data in the storage.
   */
  listIds(): Promise<ImmutableSet<string>>;

  /**
   * Reads the object corresponding to the given ID.
   *
   * @param id ID of the object to be read.
   * @return Promise that will be resolved with the object corresponding to the given ID, or null if
   *    the object does not exist.
   */
  read(id: string): Promise<TFull | null>;
}
