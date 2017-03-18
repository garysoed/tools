import { ArrayOfType } from '../check/array-of-type';
import { NonNullType } from '../check/non-null-type';
import { Arrays } from '../collection/arrays';
import { Sets } from '../collection/sets';
import { IDomBinder } from '../webc/interfaces';


export class ChildrenElementsBinder<T> implements IDomBinder<T[]> {
  private readonly dataGetter_: (element: Element) => T | null;
  private readonly dataSetter_: (data: T, element: Element, instance: any) => void;
  private readonly elementPool_: Set<Element>;
  private readonly generator_: (document: Document, instance: any) => Element;
  private readonly instance_: any;
  private readonly parentEl_: Element;
  private insertionIndex_: number;

  constructor(
      parentEl: Element,
      dataGetter: (element: Element) => T | null,
      dataSetter: (data: T, element: Element, instance: any) => void,
      generator: (document: Document, instance: any) => Element,
      insertionIndex: number,
      instance: any) {
    this.dataGetter_ = dataGetter;
    this.dataSetter_ = dataSetter;
    this.elementPool_ = new Set();
    this.generator_ = generator;
    this.insertionIndex_ = insertionIndex;
    this.instance_ = instance;
    this.parentEl_ = parentEl;
  }

  /**
   * @return The children elements with the data object.
   */
  private getChildElements_(): Element[] {
    return Arrays
        .fromItemList(this.parentEl_.children)
        .filterElement((element: Element, index: number) => {
          return index >= this.insertionIndex_ && this.dataGetter_(element) !== undefined;
        })
        .asArray();
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
   * @override
   */
  delete(): void {
    Arrays
        .fromItemList(this.parentEl_.children)
        .forEach((child: Element) => {
          this.parentEl_.removeChild(child);
        });
  }

  /**
   * @override
   */
  get(): T[] | null {
    const data = Arrays
        .of(this.getChildElements_())
        .map((child: Element) => {
          return this.dataGetter_(child);
        })
        .asArray();
    if (ArrayOfType(NonNullType<T>()).check(data)) {
      return data;
    } else {
      return null;
    }
  }

  /**
   * @override
   */
  set(value: T[] | null): void {
    let valueArray = value || [];
    let dataChildren = this.getChildElements_();

    // Make sure that there are equal number of children.
    for (let i = 0; i < valueArray.length - dataChildren.length; i++) {
      this.parentEl_.insertBefore(
          this.getElement_(),
          this.parentEl_.children.item(this.insertionIndex_ + i) || null);
    }

    for (let i = dataChildren.length - valueArray.length - 1; i >= 0; i--) {
      this.parentEl_.removeChild(this.parentEl_.children.item(this.insertionIndex_ + i));
    }

    // Now set the data.
    Arrays
        .of(valueArray)
        .forEach((value: T, index: number) => {
          let element = this.parentEl_.children.item(this.insertionIndex_ + index);
          this.dataSetter_(value, element, this.instance_);
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
      dataGetter: (element: Element) => T | null,
      dataSetter: (data: T, element: Element, instance: any) => void,
      generator: (document: Document, instance: any) => Element,
      insertionIndex: number,
      instance: any): ChildrenElementsBinder<T> {
    return new ChildrenElementsBinder(
        parentEl, dataGetter, dataSetter, generator, insertionIndex, instance);
  }
}
