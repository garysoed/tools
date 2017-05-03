export interface Storage<T> {

  /**
   * Deletes the object corresponding to the given ID.
   *
   * @param id ID of the object to delete.
   * @return Promise that will be resolved when the deletion process is successful.
   */
  delete(id: string): Promise<void>;

  /**
   * Reserves a new ID in the storage.
   * @return Promise that will be resolved with the new ID.
   */
  generateId(): Promise<string>;

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
  list(): Promise<T[]>;

  /**
   * @return IDs of the data in the storage.
   */
  listIds(): Promise<Set<string>>;

  /**
   * Reads the object corresponding to the given ID.
   *
   * @param id ID of the object to be read.
   * @return Promise that will be resolved with the object corresponding to the given ID, or null if
   *    the object does not exist.
   */
  read(id: string): Promise<T | null>;

  /**
   * Updates the given object.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   * @return Promise that will be resolved when the update operation is completed.
   */
  update(id: string, instance: T): Promise<void>;
}
