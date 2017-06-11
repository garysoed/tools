import { FiniteIterableOfType } from '../check/finite-iterable-of-type';
import { NonNullType } from '../check/non-null-type';
import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { DomBinder } from '../interfaces/dom-binder';


export interface IDataHelper<T> {
  create: (document: Document, instance: any) => Element;
  get: (element: Element) => T | null;
  set: (data: T, element: Element, instance: any) => void;
}


export class ChildrenElementsBinder<T> implements DomBinder<T[]> {
  private readonly dataHelper_: IDataHelper<T>;
  private readonly elementPool_: Set<Element>;
  private readonly endPadCount_: number;
  private readonly instance_: any;
  private readonly parentEl_: Element;
  private readonly startPadCount_: number;

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
   * @override
   */
  delete(): void {
    const children = this.parentEl_.children;
    const childrenArray: Element[] = [];
    for (let i = 0; i < children.length; i++) {
      childrenArray.push(children.item(i));
    }

    childrenArray.forEach((child: Element) => {
      this.parentEl_.removeChild(child);
    });
  }

  /**
   * @override
   */
  get(): T[] | null {
    const data = this.getChildElements_()
        .map((child: Element) => {
          return this.dataHelper_.get(child);
        });
    if (FiniteIterableOfType<T, ImmutableList<T>>(NonNullType<T>()).check(data)) {
      return data.toArray();
    } else {
      return null;
    }
  }

  /**
   * @return The children elements with the data object.
   */
  private getChildElements_(): ImmutableList<Element> {
    const lastIndex = this.parentEl_.children.length - this.endPadCount_;
    return ImmutableList
        .of(this.parentEl_.children)
        .filter((element: Element, index: number) => {
          return index >= this.startPadCount_
              && index < lastIndex
              && this.dataHelper_.get(element) !== undefined;
        });
  }

  /**
   * @return A newly created element, or a reused element from the element pool.
   */
  private getElement_(): Element {
    const element = Iterables.toArray(ImmutableSet.of(this.elementPool_))[0];
    if (!element) {
      return this.dataHelper_.create(this.parentEl_.ownerDocument, this.instance_);
    } else {
      this.elementPool_.delete(element);
      return element;
    }
  }

  /**
   * @override
   */
  set(value: T[] | null): void {
    const valueArray = value || [];
    const dataChildren = this.getChildElements_().toArray();

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
    for (const [index, value] of valueArray.entries()) {
      const element = this.parentEl_.children.item(this.startPadCount_ + index);
      this.dataHelper_.set(value, element, this.instance_);
    }
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

// TODO: Mutable
