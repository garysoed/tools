import { Records } from '../collection/records';

import { BaseValidations } from './base-validations';
import { ValidationResult } from './validation-result';


export class BatchValidations extends BaseValidations<{[key: string]: ValidationResult<any>}> {
  private batchReversed_: boolean;
  private batchValue_: {[key: string]: ValidationResult<any>};

  /**
   * @param batchValue The batch of validation results to validate.
   * @param reversed True iff the validation logic should be reversed.
   */
  constructor(batchValue: {[key: string]: ValidationResult<any>}, reversed: boolean) {
    super(batchValue, reversed);
    this.batchReversed_ = reversed;
    this.batchValue_ = batchValue;
  }

  private getMessage_(): string {
    let content = Records.of(this.batchValue_)
        .filterEntry((result: ValidationResult<any>, key: string) => {
          return !result.isValid();
        })
        .mapValue((value: ValidationResult<any>, key: string) => {
          return value.getErrorMessage();
        })
        .entries()
        .map((entry: [string, string]) => {
          return `  ${entry[0]}: ${entry[1]}`;
        })
        .asArray()
        .join(',\n');
    return `{\n${content}\n}`;
  }

  /**
   * Checks that all of the results in the batch are valid.
   *
   * @return The validation result.
   */
  allBeValid(): ValidationResult<{[key: string]: ValidationResult<any>}> {
    return this.resolve(
        Records.of(this.batchValue_).all((result: ValidationResult<any>) => {
          return result.isValid();
        }),
        `all be valid: ${this.getMessage_()}`);
  }

  /**
   * @override
   */
  resolve(result: boolean, method: string): ValidationResult<any> {
    let validationResult = super.resolve(result, method);
    let newValue = Records.of(this.batchValue_)
        .filterEntry((value: ValidationResult<any>, key: string) => {
          return value.isValid() === this.batchReversed_;
        })
        .asRecord();
    return new ValidationResult<any>(
        validationResult.isValid(),
        validationResult.getErrorMessage(),
        newValue);
  }

  /**
   * Checks that some of the results in the batch is valid.
   *
   * @return The validation result.
   */
  someBeValid(): ValidationResult<{[key: string]: ValidationResult<any>}> {
    return this.resolve(
        Records.of(this.batchValue_).some((result: ValidationResult<any>) => {
          return result.isValid();
        }),
        `some be valid: ${this.getMessage_()}`);
  }

  /**
   * @override
   */
  getValueAsString(): string {
    return 'Batch Validation';
  }
}
