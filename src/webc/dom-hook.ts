import { Validate } from '../valid/validate';

import { IDomBinder } from './interfaces';


/**
 * Hooks JS code with a location in the DOM.
 */
export class DomHook<T> {
  private deleteOnFalsy_: boolean;
  private binder_: IDomBinder<T> | null = null;

  /**
   * @param parser Parser for parsing the value at the DOM location.
   * @param deleteOnFalsy True iff the DOM location should be deleted when the value is falsy.
   */
  constructor(deleteOnFalsy: boolean) {
    this.deleteOnFalsy_ = deleteOnFalsy;
  }

  /**
   * Deletes the DOM location.
   */
  delete(): void {
    if (this.binder_ === null) {
      throw Error('"open" has not been called.');
    }
    this.binder_.delete();
  }

  /**
   * @return The value at the DOM location.
   */
  get(): T | null {
    if (this.binder_ === null) {
      throw Error('"open" has not been called.');
    }
    return this.binder_.get();
  }

  /**
   * Opens the bridge.
   * @param binder The DOM binder.
   */
  open(binder: IDomBinder<T>): void {
    Validate.any(this.binder_).toNot.exist()
        .orThrows('"open" should not have been called')
        .assertValid();
    this.binder_ = binder;
  }

  /**
   * Sets the given value at the DOM location.
   * @param value The value to set.
   */
  set(value: T): void {
    if (this.binder_ === null) {
      throw Error('"open" has not been called.');
    }

    if (!value && this.deleteOnFalsy_) {
      this.delete();
    } else {
      this.binder_.set(value);
    }
  }

  /**
   * Creates a new instance of DomHook.
   *
   * @param deleteOnFalsy True iff the DOM location should be deleted when the value is falsy.
   */
  static of<T>(deleteOnFalsy: boolean = false): DomHook<T> {
    return new DomHook<T>(deleteOnFalsy);
  }
}
