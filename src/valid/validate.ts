import { AnyValidations } from './any-validations';
import { ArrayValidations } from './array-validations';
import { BatchValidations } from './batch-validations';
import { CtorValidations } from './ctor-validations';
import { HtmlElementValidations } from './html-element-validations';
import { MapValidations } from './map-validations';
import { NumberValidations } from './number-validations';
import { SetValidations } from './set-validations';
import { StringValidations } from './string-validations';
import { ValidationResult } from './validation-result';
import { ValidationsFactory } from './validations-factory';


/**
 * Handles validations during runtime.
 *
 * Unlike [[Checks]], this is type safe and throws error. Use this when you know the type of the
 * value to validate and want to throw error. Use this class as a starting point for all
 * validations.
 *
 * Example usage:
 *
 * ```typescript
 * import { Validate } from 'valid/validate';
 *
 * Validate
 *     .batch({
 *       'array': Validate.array([]).to.beEmpty(),
 *       'string': Validate.string('Hello').toNot.beEmpty(),
 *     })
 *     .to.allBeValid()
 *     .orThrows('Something went wrong - this is a custom message')
 *     .assertValid();
 * ```
 * TODO: Make this an annotation.
 */
export class Validate {
  /**
   * Starts a general value related validations.
   *
   * @param value The value to check.
   * @return Factory object to continue the validation chain.
   */
  static any(value: any): ValidationsFactory<AnyValidations<any>> {
    return new ValidationsFactory<AnyValidations<any>>((reversed: boolean) => {
      return new AnyValidations(value, reversed);
    });
  }

  /**
   * Starts an array related validations.
   *
   * @param value The value to validate.
   * @return Factory object to continue the validation chain.
   */
  static array(value: any[]): ValidationsFactory<ArrayValidations> {
    return new ValidationsFactory<ArrayValidations>((reversed: boolean) => {
      return new ArrayValidations(value, reversed);
    });
  }

  /**
   * Starts validating the given set of validation results.
   *
   * @param results Key value pair of validation results.
   * @return Factory object to continue the validation chain.
   */
  static batch(results: {[key: string]: ValidationResult<any>}):
      ValidationsFactory<BatchValidations> {
    return new ValidationsFactory<BatchValidations>((reversed: boolean) => {
      return new BatchValidations(results, reversed);
    });
  }

  /**
   * Starts validating the given constructor.
   *
   * @param ctor The constructor to validate.
   * @return Factory object to continue the validation chain.
   */
  static ctor(ctor: gs.ICtor<any>): ValidationsFactory<CtorValidations> {
    return new ValidationsFactory<CtorValidations>((reversed: boolean) => {
      return new CtorValidations(ctor, reversed);
    });
  }

  /**
   * Utility method to immediately throw validation error.
   *
   * @param message The error message.
   */
  static fail(message: string): void {
    let result = new ValidationResult(false, message, null);
    result.assertValid();
  }

  /**
   * Starts validating the given HTML element.
   *
   * @param htmlElement The element to validate.
   * @return Factory object to continue the validation chain.
   */
  static htmlElement(htmlElement: HTMLElement): ValidationsFactory<HtmlElementValidations> {
    return new ValidationsFactory<HtmlElementValidations>((reversed: boolean) => {
      return new HtmlElementValidations(htmlElement, reversed);
    });
  }

  /**
   * Starts validating the given map.
   *
   * @param map The map to validate.
   * @return Factory object to continue the validation chain.
   */
  static map(map: Map<any, any>): ValidationsFactory<MapValidations> {
    return new ValidationsFactory<MapValidations>((reversed: boolean) => {
      return new MapValidations(map, reversed);
    });
  }

  /**
   * Starts validating the given number.
   *
   * @param value The number to validate.
   * @return Factory object to continue the validation chain.
   */
  static number(value: number): ValidationsFactory<NumberValidations> {
    return new ValidationsFactory<NumberValidations>((reversed: boolean) => {
      return new NumberValidations(value, reversed);
    });
  }

  /**
   * Starts validating the given set.
   *
   * @param set The set to validate.
   * @return Factory object to continue the validation chain.
   */
  static set(set: Set<any>): ValidationsFactory<SetValidations> {
    return new ValidationsFactory<SetValidations>((reversed: boolean) => {
      return new SetValidations(set, reversed);
    });
  }

  /**
   * Starts validating the given string.
   *
   * @param value The string to validate.
   * @return Factory object to continue the validation chain.
   */
  static string(value: string): ValidationsFactory<StringValidations> {
    return new ValidationsFactory<StringValidations>((reversed: boolean) => {
      return new StringValidations(value, reversed);
    });
  }
}
