import {BaseAssert} from './base-assert';


/**
 * Assertion for any values..
 */
export class AnyAssert<T> extends BaseAssert {
  /**
   * Checks that the value is exactly the same instance as the given object.
   */
  be(other: any): void {
    this.getMatchers_().toBe(other);
  }

  /**
   * Checks that the value is an instance of the given class.
   */
  beAnInstanceOf(clazz: Object): void {
    this.getMatchers_().toEqual(jasmine.any(clazz));
  }

  /**
   * Checks that the value is defined.
   */
  beDefined(): void {
    this.getMatchers_().toBeDefined();
  }

  /**
   * Checks that the value is falsy.
   */
  beFalsy(): void {
    this.getMatchers_().toBeFalsy();
  }

  /**
   * Checks that the value is null.
   */
  beNull(): void {
    this.getMatchers_().toBeNull();
  }

  /**
   * Checks that the value is truthy.
   */
  beTruthy(): void {
    this.getMatchers_().toBeTruthy();
  }

  /**
   * Checks that the value is equal to the given value.
   */
  equal(other: T): void {
    this.getMatchers_().toEqual(other);
  }
}
