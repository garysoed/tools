import { Observable } from 'rxjs';

import { ArrayDiff } from '../rxjs/state/array-observable';

export interface ReadableStorage<TFull> {
  /**
   * Finds the index of the given ID.
   */
  findIndex(id: string): Observable<number|null>;

  /**
   * Checks if the object corresponding to the given ID exists in the storage.
   *
   * @param id ID of the object to be checked.
   * @returns Observable that emits true iff the object exists in the storage.
   */
  has(id: string): Observable<boolean>;

  /**
   * @returns IDs of the data in the storage.
   */
  listIds(): Observable<ArrayDiff<string>>;

  /**
   * Reads the object corresponding to the given ID.
   *
   * @param id ID of the object to be read.
   * @returns Observable that emits the object corresponding to the given ID, or null if the object
   *     does not exist.
   */
  read(id: string): Observable<TFull|null>;
}
