import { AnyValidations } from './any-validations';
import { ValidationResult } from './validation-result';


/**
 * String related assertions.
 */
export class StringValidations extends AnyValidations<string> {
  private stringValue_: string;

  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: string, reversed: boolean) {
    super(value, reversed);
    this.stringValue_ = value;
  }

  /**
   * Checks that the string is empty.
   *
   * @return The resolution object.
   */
  beEmpty(): ValidationResult<string> {
    return this.resolve(this.stringValue_.length === 0, 'be empty');
  }
}
