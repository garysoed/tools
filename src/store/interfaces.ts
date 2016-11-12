export interface Storage<T> {
  /**
   * Creates the given object in the storage.
   *
   * @param id ID of the object to be created.
   * @param instance The object to be stored.
   * @return Promise that will be resolved when the creation process is successful.
   */
  create(id: string, instance: T): Promise<void>;

  /**
   * Deletes the object corresponding to the given ID.
   *
   * @param id ID of the object to delete.
   * @return Promise that will be resolved when the deletion process is successful.
   */
  delete(id: string): Promise<void>;

  /**
   * Checks if the object corresponding to the given ID exists in the storage.
   *
   * @param id ID of the object to be checked.
   * @return Promise that will be resolved with true iff the object exists in the storage.
   */
  has(id: string): Promise<boolean>;

  /**
   * @return IDs of the data in the storage.
   */
  list(): Promise<string[]>;

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
