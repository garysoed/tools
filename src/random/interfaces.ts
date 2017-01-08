export interface IdGenerator {
  /**
   * Generates a new ID.
   *
   * @return The newly generated ID.
   */
  generate(): string;

  /**
   * Attempts to resolve a conflict for the given ID.
   *
   * This is a best effort method to come up with another ID based on the knowledge that the given
   * ID already conflicts.
   *
   * @param id The conflicting ID.
   * @return Best effort new ID.
   */
  resolveConflict(id: string): string;
}
