import { AnyValidations } from './any-validations';
import { ValidationResult } from './validation-result';


/**
 * Constructor related validations.
 */
export class CtorValidations extends AnyValidations<gs.ICtor<any>> {
  private ctorValue_: gs.ICtor<any>;

  /**
   * @param value The constructor to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: gs.ICtor<any>, reversed: boolean) {
    super(value, reversed);
    this.ctorValue_ = value;
  }

  /**
   * Asserts that the constructor is a descendant or is the same as the given constructor.
   *
   * @param ctor The ancestor constructor to check.
   */
  extend(ctor: gs.ICtor<any>): ValidationResult<gs.ICtor<any>> {
    return this.resolve(
        this.ctorValue_ === ctor || this.ctorValue_.prototype instanceof ctor,
        `extend ${ctor.name}`);
  }

  /**
   * @override
   */
  getValueAsString(): string {
    return this.ctorValue_.name;
  }
}
