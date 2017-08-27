/**
 * Represents a type used for type checking.
 * @param <T> The type to check.
 */
export interface Type<T> {
  /**
   * Checks if the target is of type T.
   * @param target Target to check.
   * @return True iff the target is of type T.
   */
  check(target: any): target is T;

  /**
   * @return String representation of the type.
   */
  toString(): string;
}
