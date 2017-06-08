/**
 * Describes a binder to a dom location.
 */
export interface DomBinder<T> {
  /**
   * Deletes the value.
   */
  delete(): void;

  /**
   * @return The value at the location.
   */
  get(): T | null;

  /**
   * Sets the value to the location.
   * @param value The value to set.
   */
  set(value: T | null): void;
}
