/**
 * Base class for all fluent collection classes.
 *
 * @param <T> Type of the underlying collection data.
 */
class BaseFluent<T> {
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
  get data(): T {
    return this.data_;
  }
}

export default BaseFluent;
