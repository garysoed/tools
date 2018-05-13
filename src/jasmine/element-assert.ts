import { AnyAssert } from './any-assert';


export class ElementAssert extends AnyAssert<Element> {
  private readonly elementValue_: Element;

  constructor(
      elementValue: Element,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers<Element>) {
    super(elementValue, reversed, expect);
    this.elementValue_ = elementValue;
  }

  /**
   * Asserts that the element has the specified children.
   */
  haveChildren(expectedChildren: Element[]): void {
    const children: Element[] = [];
    for (let i = 0; i < this.elementValue_.children.length; i++) {
      children.push(this.elementValue_.children.item(i));
    }

    this.getMatchers_(children).toEqual(expectedChildren);
  }

  haveClasses(expectedClasses: string[]): void {
    const classes: string[] = [];
    for (let i = 0; i < this.elementValue_.classList.length; i++) {
      classes.push(this.elementValue_.classList.item(i));
    }
    this.getMatchers_(classes).toEqual(expectedClasses);
  }
}
