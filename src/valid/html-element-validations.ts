import {AnyValidations} from './any-validations';
import {ValidationResult} from './validation-result';


/**
 * Validations for HTMLElements.
 */
export class HtmlElementValidations extends AnyValidations<HTMLElement> {
  constructor(
      private htmlElement_: HTMLElement,
      reversed: boolean) {
    super(htmlElement_, reversed);
  }

  /**
   * Checks that the HTML element has the given name. This check is case insensitive.
   */
  beNamed(name: string): ValidationResult<HTMLElement> {
    let nodeName = this.htmlElement_.nodeName.toLocaleLowerCase();
    return this.resolve(
        name.toLocaleLowerCase() === nodeName,
        `be named ${name}`);
  }
}
