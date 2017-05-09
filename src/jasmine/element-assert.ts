import { AnyAssert } from './any-assert';


export class ElementAssert extends AnyAssert<Element> {
  private readonly elementValue_: Element;

  constructor(elementValue: Element, reversed: boolean, expect: (actual: any) => jasmine.Matchers) {
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
}
// TODO: Mutable
