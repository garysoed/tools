import {ValidationResult} from './validation-result';


/**
 * Base class of all validations.
 *
 * @param <V> Type of the value.
 */
export class BaseValidations<V> {
  private reversed_: boolean;
  private value_: V;

  /**
   * @param value The value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: V, reversed: boolean) {
    this.reversed_ = reversed;
    this.value_ = value;
  }

  /**
   * Resolves the validation with the given result.
   *
   * @param result True iff the validation passes, ignoring reversal rule.
   * @param method The validation method. This should look like `be empty`, or `contain`. This will
   *    be appended like: `Expected ${value} to (not) ${method}`.
   */
  resolve(result: boolean, method: string): ValidationResult<V> {
    let normalizedMethod = this.reversed_ ? `not ${method}` : method;

    return new ValidationResult<V>(
        result !== this.reversed_,
        `Expected [${this.valueAsString}] to ${normalizedMethod}.`,
        this.value_);
  }

  /**
   * @return The value as string.
   */
  get valueAsString(): string {
    return String(this.value_);
  }
}
