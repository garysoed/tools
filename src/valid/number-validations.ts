import {BaseValidations} from './base-validations';
import {ValidationResult} from './validation-result';


export class NumberValidations extends BaseValidations<number> {
  private numberValue_: number;

  constructor(value: number, reversed: boolean) {
    super(value, reversed);
    this.numberValue_ = value;
  }

  /**
   * Checks that the number is greater than the given number.
   */
  beGreaterThan(other: number): ValidationResult<number> {
    return this.resolve(this.numberValue_ > other, `be greater than ${other}`);
  }

  /**
   * Checks that the number is greater than or equal to the given number.
   */
  beGreaterThanOrEqualTo(other: number): ValidationResult<number> {
    return this.resolve(this.numberValue_ >= other, `be greater than or equal to ${other}`);
  }

  /**
   * Checks that the number is an integer.
   */
  beAnInteger(): ValidationResult<number> {
    return this.resolve(Number.isInteger(this.numberValue_), 'be an integer');
  }
}
