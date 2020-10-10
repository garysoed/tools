import { Observable } from 'rxjs';


/**
 * Storage that can be read.
 *
 * @typeParam T - Type of data stored in the storage.
 * @thModule store
 */
export interface ReadableStorage<T> {
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
  readonly idList$: Observable<ReadonlySet<string>>;

  /**
   * Reads the object corresponding to the given ID.
   *
   * @param id ID of the object to be read.
   * @returns Observable that emits the object corresponding to the given ID, or undefined if the
   *     object does not exist.
   */
  read(id: string): Observable<T|undefined>;
}
