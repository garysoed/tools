import { Observable } from '@rxjs';
import { ReadableStorage } from './readable-storage';

export interface EditableStorage<TFull> extends ReadableStorage<TFull> {

  clear(): Observable<unknown>;

  /**
   * Deletes the object corresponding to the given ID.
   *
   * @param id ID of the object to delete.
   */
  delete(id: string): Observable<unknown>;

  /**
   * Deletes the object at the given index.
   */
  deleteAt(index: number): Observable<unknown>;

  /**
   * Reserves a new ID in the storage.
   * @return Observable that emits new IDs. The IDs emitted are guaranteed to be unique at the time
   *     of emission.
   */
  generateId(): Observable<string>;

  /**
   * Inserts the object at the given index.
   */
  insertAt(index: number, id: string, instance: TFull): Observable<unknown>;

  /**
   * Updates the given object.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   */
  update(id: string, instance: TFull): Observable<unknown>;

  /**
   * Sets the object at the given index.
   */
  updateAt(index: number, id: string, instance: TFull): Observable<unknown>;
}
