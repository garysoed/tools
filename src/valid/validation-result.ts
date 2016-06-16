/**
 * Represents the result of a validation process.
 * @param <V> Type of the value that was being validated.
 */
export class ValidationResult<V> {
  private value_: any;
  private errorMessage_: string;
  private passes_: boolean;

  /**
   * @param passes True iff the validation passes.
   * @param errorMessage The error message to display if the validation fails.
   * @param value The value being validated.
   */
  constructor(passes: boolean, errorMessage: string, value: V) {
    this.errorMessage_ = errorMessage;
    this.passes_ = passes;
    this.value_ = value;
  }

  /**
   * Performs the validation. This throws an error if the validation did not pass.
   */
  assertValid(): void {
    if (!this.passes_) {
      throw new Error(this.errorMessage_);
    }
  }

  /**
   * The error message. Null if the validation passes.
   */
  get errorMessage(): string {
    return this.passes_ ? null : this.errorMessage_;
  }

  /**
   * Overrides the default error message with the given one.
   * 
   * @param errorMessage The overriding error message.
   */
  orThrows(errorMessage: string): ValidationResult<V> {
    return new ValidationResult<V>(this.passes_, errorMessage, this.value_);
  }

  /**
   * True iff the validation passed.
   */
  get passes(): boolean {
    return this.passes_;
  }

  /**
   * The value being validated.
   */
  get value(): V {
    return this.value_;
  }
}
