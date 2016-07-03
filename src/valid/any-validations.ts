import {BaseValidations} from './base-validations';
import {ValidationResult} from './validation-result';


/**
 * Validations for any values.
 */
export class AnyValidations<V> extends BaseValidations<V> {
  private anyValue_: any;

  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: any, reversed: boolean) {
    super(value, reversed);
    this.anyValue_ = value;
  }

  /**
   * Checks that the value is not undefined.
   * 
   * @return The validation result.
   */
  beDefined(): ValidationResult<any> {
    return this.resolve(this.anyValue_ !== undefined, 'be defined');
  }

  /**
   * Checks that the value is equal to the given value.
   *
   * @param other The other value to compare against.
   * @return The validation result.
   */
  beEqualTo(other: any): ValidationResult<any> {
    return this.resolve(this.anyValue_ === other, `be equal to ${other}`);
  }

  /**
   * Checks that the value is equal to null.
   * 
   * @return The validation result.
   */
  beNull(): ValidationResult<any> {
    return this.resolve(this.anyValue_ === null, `be null`);
  }
}
