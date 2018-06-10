import { ReadableStorage } from './readable-storage';

export interface EditableStorage<TFull, TSummary = TFull> extends ReadableStorage<TFull, TSummary> {

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
   * Updates the given object.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   * @return Promise that will be resolved when the update operation is completed.
   */
  update(id: string, instance: TFull): Promise<void>;
}
