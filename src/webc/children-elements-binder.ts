import {Arrays} from '../collection/arrays';
import {Sets} from '../collection/sets';

import {IDomBinder} from './interfaces';


export const __data = Symbol('data');


export class ChildrenElementsBinder<T> implements IDomBinder<T[]> {
  private readonly dataSetter_: (data: T, element: Element, instance: any) => void;
  private readonly elementPool_: Set<Element>;
  private readonly generator_: (document: Document, instance: any) => Element;
  private readonly instance_: any;
  private readonly parentEl_: Element;

  constructor(
      parentEl: Element,
      dataSetter: (data: T, element: Element, instance: any) => void,
      generator: (document: Document, instance: any) => Element,
      instance: any) {
    this.dataSetter_ = dataSetter;
    this.elementPool_ = new Set();
    this.generator_ = generator;
    this.instance_ = instance;
    this.parentEl_ = parentEl;
  }

  /**
   * @param element The element whose embedded data should be returned.
   * @return The data embedded in the given element.
   */
  private getData_(element: Element): T {
    return element[__data];
  }

  /**
   * @return A newly created element, or a reused element from the element pool.
   */
  private getElement_(): Element {
    let element = Sets.of(this.elementPool_).anyValue();
    if (element === null) {
      return this.generator_(this.parentEl_.ownerDocument, this.instance_);
    } else {
      this.elementPool_.delete(element);
      return element;
    }
  }

  /**
   * Embeds the given data into the given element.
   * @param element The element to embed the data in.
   * @param data The data to embed.
   */
  private setData_(element: Element, data: T): void {
    element[__data] = data;
  }

  /**
   * @override
   */
  delete(): void {
    Arrays
        .fromHtmlCollection(this.parentEl_.children)
        .forEach((child: Element) => {
          this.parentEl_.removeChild(child);
        });
  }

  /**
   * @override
   */
  get(): T[] {
    return Arrays
        .fromHtmlCollection(this.parentEl_.children)
        .map((child: Element) => {
          return this.getData_(child);
        })
        .asArray();
  }

  /**
   * @override
   */
  set(value: T[] | null): void {
    let valueArray = value || [];

    // Make sure that there are equal number of children.
    while (this.parentEl_.children.length < valueArray.length) {
      this.parentEl_.appendChild(this.getElement_());
    }

    while (this.parentEl_.children.length > valueArray.length) {
      this.parentEl_.removeChild(this.parentEl_.children.item(0));
    }

    // Now set the data.
    Arrays
        .of(valueArray)
        .forEach((value: T, index: number) => {
          let element = this.parentEl_.children.item(index);
          this.dataSetter_(value, element, this.instance_);
          this.setData_(element, value);
        });
  }

  /**
   * Creates a new instance of the binder.
   *
   * @param parentEl Element to append the children to.
   * @param dataSetter Function called to set the data to the generated element.
   * @param generator Generates a new element.
   * @return New instance of the binder.
   */
  static of<T>(
      parentEl: Element,
      dataSetter: (data: T, element: Element, instance: any) => void,
      generator: (document: Document, instance: any) => Element,
      instance: any): ChildrenElementsBinder<T> {
    return new ChildrenElementsBinder(parentEl, dataSetter, generator, instance);
  }
}
