import { AnyValidations } from './any-validations';
import { ValidationResult } from './validation-result';


/**
 * Validations for any sets.
 */
export class SetValidations extends AnyValidations<Set<any>> {
  private setValue_: Set<any>;

  /**
   * @param value The set to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: Set<any>, reversed: boolean) {
    super(value, reversed);
    this.setValue_ = value;
  }

  /**
   * Validates that the set is empty.
   */
  beEmpty(): ValidationResult<Set<any>> {
    return this.resolve(this.setValue_.size === 0, 'be empty');
  }

  /**
   * Validates that the set contains the given element.
   *
   * @param element The element to check.
   */
  contain(element: any): ValidationResult<Set<any>> {
    return this.resolve(this.setValue_.has(element), `contain ${element}`);
  }
}
