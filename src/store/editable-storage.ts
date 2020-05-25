import { Observable } from 'rxjs';

import { ReadableStorage } from './readable-storage';

export interface EditableStorage<T> extends ReadableStorage<T> {
  clear(): Observable<unknown>;

  /**
   * Deletes the object corresponding to the given ID.
   *
   * @param id - ID of the object to delete.
   */
  delete(id: string): Observable<unknown>;

  /**
   * Deletes the object at the given index.
   */
  deleteAt(index: number): Observable<unknown>;

  /**
   * Reserves a new ID in the storage.
   * @returns Observable that emits new IDs. The IDs emitted are guaranteed to be unique at the time
   *     of emission.
   */
  generateId(): Observable<string>;

  /**
   * Inserts the object at the given index.
   */
  insertAt(index: number, id: string, instance: T): Observable<unknown>;

  /**
   * Updates the given object. If it doesn't exist, add the object.
   *
   * @param id ID of the object to update.
   * @param instance Object to update.
   */
  update(id: string, instance: T): Observable<unknown>;

  /**
   * Sets the object at the given index.
   */
  updateAt(index: number, id: string, instance: T): Observable<unknown>;
}
