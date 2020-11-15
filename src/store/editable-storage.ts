import {ReadableStorage} from './readable-storage';


/**
 * Storage that can be modified and read.
 *
 * @typeParam T - Type of data stored.
 * @thModule store
 */
export interface EditableStorage<T> extends ReadableStorage<T> {

  /**
   * Clears all data in the storage.
   */
  clear(): void;

  /**
   * Deletes the object corresponding to the given ID.
   *
   * @param id - ID of the object to delete.
   * @returns True iff the ID existed in the storage.
   */
  delete(id: string): boolean;

  /**
   * Updates the given ID to the given instance.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   * @returns True iff the ID existed in the storage.
   */
  update(id: string, instance: T): boolean;
}
