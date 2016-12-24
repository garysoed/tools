export interface IdGenerator {
  /**
   * Generates a new ID.
   *
   * @return The newly generated ID.
   */
  generate(): string;

  /**
   * Attempts to resolve a conflict for the given ID.
   *
   * This is a best effort method to come up with another ID based on the knowledge that the given
   * ID already conflicts.
   *
   * @param id The conflicting ID.
   * @return Best effort new ID.
   */
  resolveConflict(id: string): string;
}

export interface Storage<T> {

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
   * Reserves a new ID in the storage.
   * @return Promise that will be resolved with the new ID.
   */
  generateId(): Promise<string>;

  /**
   * Updates the given object.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   * @return Promise that will be resolved when the update operation is completed.
   */
  update(id: string, instance: T): Promise<void>;
}
