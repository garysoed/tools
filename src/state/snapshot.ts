import { StateId } from './state-id';

/**
 * Pair of ID and object.
 *
 * @thHidden
 */
export interface IdObject {
  /**
   * ID corresponding to the object.
   */
  readonly id: string;
  /**
   * The value stored.
   */
  readonly obj: any;
}

/**
 * Snapshot of all objects in the global state.
 *
 * @typeParams R - Type of the root object.
 * @thHidden
 */
export interface Snapshot<R> {
  /**
   * ID of the root object.
   */
  readonly rootId: StateId<R>;
  /**
   * All objects in the snapshot.
   */
  readonly payloads: readonly IdObject[];
}
