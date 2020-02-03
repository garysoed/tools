import { RandomResult } from './random-generator';

/**
 * Base class of all ID generators.
 */
export abstract class BaseIdGenerator {

  /**
   * Generates a new ID that is different from any of the given existing IDs.
   * @param existingIds IDs that already exist.
   * @return Newly generated ID.
   */
  generate(existingIds: Iterable<string>): string {
    const existingSet = new Set(existingIds);
    let id = this.newId();
    while (existingSet.has(id)) {
      id = this.resolveConflict(id);
    }

    return id;
  }


  /**
   * Generates a new ID.
   *
   * @return The newly generated ID.
   */
  protected abstract newId(): string;

  /**
   * Attempts to resolve a conflict for the given ID.
   *
   * This is a best effort method to come up with another ID based on the knowledge that the given
   * ID already conflicts.
   *
   * @param id The conflicting ID.
   * @return Best effort new ID.
   */
  protected abstract resolveConflict(id: string): string;
}
