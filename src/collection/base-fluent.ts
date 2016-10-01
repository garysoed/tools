/**
 * Base class for all fluent collection classes.
 *
 * @param <T> Type of the underlying collection data.
 */
export class BaseFluent<T> {
  private data_: T;

  /**
   * @param data The underlying collection data.
   */
  constructor(data: T) {
    this.data_ = data;
  }

  /**
   * The underlying data object.
   */
  protected getData(): T {
    return this.data_;
  }
}
