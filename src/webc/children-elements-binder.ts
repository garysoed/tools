import { ArrayOfType } from '../check/array-of-type';
import { NonNullType } from '../check/non-null-type';
import { Arrays } from '../collection/arrays';
import { Sets } from '../collection/sets';
import { IDomBinder } from '../webc/interfaces';


export interface IDataHelper<T> {
  create: (document: Document, instance: any) => Element;
  get: (element: Element) => T | null;
  set: (data: T, element: Element, instance: any) => void;
}


export class ChildrenElementsBinder<T> implements IDomBinder<T[]> {
  private readonly dataHelper_: IDataHelper<T>;
  private readonly elementPool_: Set<Element>;
  private readonly endPadCount_: number;
  private readonly instance_: any;
  private readonly startPadCount_: number;
  private readonly parentEl_: Element;

  constructor(
      parentEl: Element,
      helper: IDataHelper<T>,
      startPadCount: number,
      endPadCount: number,
      instance: any) {
    this.dataHelper_ = helper;
    this.endPadCount_ = endPadCount;
    this.elementPool_ = new Set();
    this.startPadCount_ = startPadCount;
    this.instance_ = instance;
    this.parentEl_ = parentEl;
  }

  /**
   * @return The children elements with the data object.
   */
  private getChildElements_(): Element[] {
    const lastIndex = this.parentEl_.children.length - this.endPadCount_;
    return Arrays
        .fromItemList(this.parentEl_.children)
        .filterElement((element: Element, index: number) => {
          return index >= this.startPadCount_
              && index < lastIndex
              && this.dataHelper_.get(element) !== undefined;
        })
        .asArray();
  }

  /**
   * @return A newly created element, or a reused element from the element pool.
   */
  private getElement_(): Element {
    const element = Sets.of(this.elementPool_).anyValue();
    if (element === null) {
      return this.dataHelper_.create(this.parentEl_.ownerDocument, this.instance_);
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
          return this.dataHelper_.get(child);
        })
        .asArray();
    if (ArrayOfType<T>(NonNullType<T>()).check(data)) {
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
          this.parentEl_.children.item(this.startPadCount_ + i) || null);
    }

    for (let i = dataChildren.length - valueArray.length - 1; i >= 0; i--) {
      this.parentEl_.removeChild(this.parentEl_.children.item(this.startPadCount_ + i));
    }

    // Now set the data.
    Arrays
        .of(valueArray)
        .forEach((value: T, index: number) => {
          const element = this.parentEl_.children.item(this.startPadCount_ + index);
          this.dataHelper_.set(value, element, this.instance_);
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
      dataHelper: IDataHelper<T>,
      startPadCount: number,
      endPadCount: number,
      instance: any): ChildrenElementsBinder<T> {
    return new ChildrenElementsBinder(parentEl, dataHelper, startPadCount, endPadCount, instance);
  }
}
