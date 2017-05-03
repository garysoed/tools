/**
 * A set that sorts its elements in insertion order.
 *
 * Duplicates are moved to the location where the element are last inserted.
 *
 * @param <T> Type of element in the set.
 */
class SortedSet<T> implements Iterable<T> {
  private array_: T[];
  private positions_: Map<T, number>;

  constructor() {
    this.array_ = [];
    this.positions_ = new Map<T, number>();
  }

  /**
   * Returns the [[Iterator]] for this set.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.array_[Symbol.iterator]();
  }

  /**
   * Returns element at the given position.
   *
   * @param position Position of the element to return.
   * @return Element at the given position, or undefined if it does not exist.
   */
  getAt(position: number): T {
    return this.array_[position];
  }

  /**
   * Number of elements in the set.
   */
  getSize(): number {
    return this.array_.length;
  }

  /**
   * Inserts the given element at the given position.
   *
   * @param value The element to insert.
   * @param position Position to insert the element to.
   */
  insertAt(value: T, position: number): void {
    this.remove(value);
    this.array_.splice(position, 0, value);
    this.positions_.set(value, position);
  }

  /**
   * Inserts the given element at the end of the set.
   *
   * @param value The element to insert.
   */
  push(value: T): void {
    this.insertAt(value, this.getSize());
  }

  /**
   * Removes the given element from the set.
   *
   * @param value The element to be removed.
   */
  remove(value: T): void {
    if (this.positions_.has(value)) {
      this.array_.splice(this.positions_.get(value)!, 1);
      this.positions_.delete(value);
    }
  }
}

export default SortedSet;
