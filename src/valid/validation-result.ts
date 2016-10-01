/**
 * Represents the result of a validation process.
 * @param <V> Type of the value that was being validated.
 */
export class ValidationResult<V> {
  private value_: any;
  private errorMessage_: (string|null);
  private passes_: boolean;

  /**
   * @param passes True iff the validation passes.
   * @param errorMessage The error message to display if the validation fails.
   * @param value The value being validated.
   */
  constructor(passes: boolean, errorMessage: (string|null), value: V) {
    this.errorMessage_ = errorMessage;
    this.passes_ = passes;
    this.value_ = value;
  }

  /**
   * Performs the validation. This throws an error if the validation did not pass.
   */
  assertValid(): void {
    if (!this.passes_) {
      throw new Error(this.errorMessage_ || '');
    }
  }

  /**
   * The error message. Null if the validation passes.
   */
  getErrorMessage(): (string|null) {
    return this.passes_ ? null : this.errorMessage_;
  }

  /**
   * Overrides the default error message with the given one.
   *
   * The given error message may refer to the value being tested by using '${value}'. For example,
   * `Validate.string('blah').toNot.beEmpty().orThrows('a ${value}')` will throw 'a blah'.
   *
   * @param errorMessage The overriding error message.
   */
  orThrows(errorMessage: string): ValidationResult<V> {
    let subbedErrorMessage = errorMessage.replace(/\${value}/g, JSON.stringify(this.value_));
    return new ValidationResult<V>(this.passes_, subbedErrorMessage, this.value_);
  }

  /**
   * The value being validated.
   */
  getValue(): V {
    return this.value_;
  }

  /**
   * True iff the validation passed.
   */
  isValid(): boolean {
    return this.passes_;
  }
}
