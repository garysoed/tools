/**
 * An collection (not Collection) with a known size, but we don't know what the items are.
 */
export interface Finite {
  /**
   * The number of items in the collection.
   */
  size(): number;
}
