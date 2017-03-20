import { AnyValidations } from './any-validations';
import { ValidationResult } from './validation-result';


/**
 * Validations for any arrays.
 */
export class ArrayValidations extends AnyValidations<any[]> {
  private arrayValue_: any[];

  /**
   * @param value The array to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: any[], reversed: boolean) {
    super(value, reversed);
    this.arrayValue_ = value;
  }

  /**
   * Validates that the array is empty.
   */
  beEmpty(): ValidationResult<any[]> {
    return this.resolve(this.arrayValue_.length === 0, 'be empty');
  }

  /**
   * Validates that the array contains the given element.
   *
   * @param element The element to check.
   */
  contain(element: any): ValidationResult<any[]> {
    return this.resolve(this.arrayValue_.indexOf(element) >= 0, `contain ${element}`);
  }
}
