import { Observable } from 'rxjs';
import { ReadableStorage } from './readable-storage';

export interface EditableStorage<TFull> extends ReadableStorage<TFull> {

  /**
   * Deletes the object corresponding to the given ID.
   *
   * @param id ID of the object to delete.
   */
  delete(id: string): Observable<unknown>;

  /**
   * Reserves a new ID in the storage.
   * @return Observable that emits new IDs. The IDs emitted are guaranteed to be unique at the time
   *     of emission.
   */
  generateId(): Observable<string>;

  /**
   * Updates the given object.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   */
  update(id: string, instance: TFull): Observable<unknown>;
}
