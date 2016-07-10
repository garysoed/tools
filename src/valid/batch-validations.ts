import {BaseValidations} from './base-validations';
import {Records} from '../collection/records';
import {ValidationResult} from './validation-result';


export class BatchValidations extends BaseValidations<{[key: string]: ValidationResult<any>}> {
  private batchValue_: {[key: string]: ValidationResult<any>};

  /**
   * @param batchValue The batch of validation results to validate.
   * @param reversed True iff the validation logic should be reversed.
   */
  constructor(batchValue: {[key: string]: ValidationResult<any>}, reversed: boolean) {
    super(batchValue, reversed);
    this.batchValue_ = batchValue;
  }

  private getMessage_(): string {
    let content = Records.of(this.batchValue_)
        .filterEntry((result: ValidationResult<any>, key: string) => {
          return !result.passes;
        })
        .mapValue((value: ValidationResult<any>, key: string) => {
          return value.errorMessage;
        })
        .entries()
        .map((entry: [string, string]) => {
          return `${entry[0]}: ${entry[1]}`;
        })
        .asArray()
        .join(', ');
    return `{${content}}`;
  }

  /**
   * Checks that all of the results in the batch are valid.
   *
   * @return The validation result.
   */
  allBeValid(): ValidationResult<{[key: string]: ValidationResult<any>}> {
    return this.resolve(
        Records.of(this.batchValue_).all((result: ValidationResult<any>) => {
          return result.passes;
        }),
        `all be valid: ${this.getMessage_()}`);
  }

  /**
   * Checks that some of the results in the batch is valid.
   *
   * @return The validation result.
   */
  someBeValid(): ValidationResult<{[key: string]: ValidationResult<any>}> {
    return this.resolve(
        Records.of(this.batchValue_).some((result: ValidationResult<any>) => {
          return result.passes;
        }),
        `some be valid: ${this.getMessage_()}`);
  }

  /**
   * @override
   */
  get valueAsString(): string {
    return 'Batch Validation';
  }
}
