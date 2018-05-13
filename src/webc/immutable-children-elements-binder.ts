import { FiniteIterableOfType, NonNullType } from '../check';
import { ImmutableList, ImmutableSet } from '../immutable';
import { DomBinder } from '../interfaces';
import { DataBridge } from '../interfaces/data-bridge';

export class ChildrenElementsBinder<T> implements DomBinder<ImmutableList<T>> {
  private readonly elementPool_: Set<Element>;

  constructor(
      private readonly parentEl_: Element,
      private readonly dataBridge_: DataBridge<T>,
      private readonly startPadCount_: number,
      private readonly endPadCount_: number,
      private readonly instance_: any) {
    this.elementPool_ = new Set();
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
  get(): ImmutableList<T> | null {
    const data = this.getChildElements_()
        .map((child: Element) => {
          return this.dataBridge_.get(child);
        });
    if (FiniteIterableOfType<T, ImmutableList<T>>(NonNullType<T>()).check(data)) {
      return data;
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
              && this.dataBridge_.get(element) !== undefined;
        });
  }

  /**
   * @return A newly created element, or a reused element from the element pool.
   */
  getElement_(): Element {
    const element = [...ImmutableSet.of(this.elementPool_)][0];
    if (!element) {
      return this.dataBridge_.create(this.parentEl_.ownerDocument, this.instance_);
    } else {
      this.elementPool_.delete(element);
      return element;
    }
  }

  /**
   * @override
   */
  set(value: ImmutableList<T> | null): void {
    const valueArray = value || ImmutableList.of([]);
    const dataChildren = [...this.getChildElements_()];

    // Make sure that there are equal number of children.
    for (let i = 0; i < valueArray.size() - dataChildren.length; i++) {
      this.parentEl_.insertBefore(
          this.getElement_(),
          this.parentEl_.children.item(this.startPadCount_ + i) || null);
    }

    for (let i = dataChildren.length - valueArray.size() - 1; i >= 0; i--) {
      this.parentEl_.removeChild(this.parentEl_.children.item(this.startPadCount_ + i));
    }

    // Now set the data.
    for (const [index, value] of valueArray.entries()) {
      const element = this.parentEl_.children.item(this.startPadCount_ + index);
      this.dataBridge_.set(value, element, this.instance_);
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
      dataBridge: DataBridge<T>,
      startPadCount: number,
      endPadCount: number,
      instance: any): ChildrenElementsBinder<T> {
    return new ChildrenElementsBinder(parentEl, dataBridge, startPadCount, endPadCount, instance);
  }
}
