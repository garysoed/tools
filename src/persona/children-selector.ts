import { FiniteIterableOfType, Type } from '../check';
import { AssertionError } from '../error';
import { instanceId } from '../graph';
import { ImmutableList, ImmutableSet } from '../immutable';
import {
  ElementSelector,
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';
import { Selector, SelectorImpl, SelectorStub } from '../persona/selector';

type Factory<E extends Element> = (document: Document) => E;
type Getter<E extends Element, T> = (element: E) => T | null;
type Setter<E extends Element, T> = (data: T, element: E) => void;

export interface ChildrenSelector<T> extends Selector<ImmutableList<T>> { }

export class ChildrenSelectorStub<E extends Element, T> extends
    SelectorStub<ImmutableList<T>> implements ChildrenSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorStub<HTMLElement>,
      private readonly factory_: Factory<E>,
      private readonly getter_: Getter<E, T>,
      private readonly setter_: Setter<E, T>,
      private readonly childDataType_: Type<T>,
      private readonly childType_: Type<E>,
      private readonly startPadCount_: number,
      private readonly endPadCount_: number) {
    super();
  }

  resolve(allSelectors: {}): ChildrenSelectorImpl<E, T> {
    return new ChildrenSelectorImpl(
        this.elementSelector_.resolve(allSelectors),
        this.factory_,
        this.getter_,
        this.setter_,
        this.childDataType_,
        this.childType_,
        this.startPadCount_,
        this.endPadCount_);
  }
}

export class ChildrenSelectorImpl<E extends Element, T> extends
    SelectorImpl<ImmutableList<T>> implements ChildrenSelector<T> {
  private readonly elementPool_: Set<E> = new Set();

  constructor(
      private readonly elementSelector_: ElementSelectorImpl<HTMLElement>,
      private readonly factory_: Factory<E>,
      private readonly getter_: Getter<E, T>,
      private readonly setter_: Setter<E, T>,
      private readonly childDataType_: Type<T>,
      private readonly childType_: Type<E>,
      private readonly startPadCount_: number,
      private readonly endPadCount_: number) {
    super(
        instanceId(`${elementSelector_.getSelector()}@children`,
        FiniteIterableOfType(childDataType_)));
  }

  private getChildElements_(root: ShadowRoot): ImmutableList<E> {
    const parentEl = this.elementSelector_.getValue(root);
    const lastIndex = parentEl.children.length - this.endPadCount_;
    const elements = [];
    for (let i = this.startPadCount_; i < lastIndex; i++) {
      const child = parentEl.children.item(i);
      if (!this.childType_.check(child)) {
        throw AssertionError.type(`child[${i}]`, this.childType_, child);
      }
      elements.push(child);
    }
    return ImmutableList.of(elements);
  }

  private getElement_(parentEl: HTMLElement): E {
    const element = [...ImmutableSet.of(this.elementPool_)][0];
    if (!element) {
      return this.factory_(parentEl.ownerDocument);
    } else {
      this.elementPool_.delete(element);
      return element;
    }
  }

  getValue(root: ShadowRoot): ImmutableList<T> {
    return this.getChildElements_(root)
        .map((childElement: E, index: number) => {
          const data = this.getter_(childElement);
          if (!this.childDataType_.check(data)) {
            throw AssertionError.type(`childData[${index}]`, this.childDataType_, data);
          }

          return data;
        }) as ImmutableList<T>;
  }

  setValue(value: ImmutableList<T> | null, root: ShadowRoot): void {
    const valueArray = value || ImmutableList.of([]);
    const dataChildren = this.getChildElements_(root);
    const parentEl = this.elementSelector_.getValue(root);

    // Make sure that there are equal number of children.
    for (let i = 0; i < valueArray.size() - dataChildren.size(); i++) {
      parentEl.insertBefore(
          this.getElement_(parentEl),
          parentEl.children.item(this.startPadCount_ + i) || null);
    }

    for (let i = dataChildren.size() - valueArray.size() - 1; i >= 0; i--) {
      parentEl.removeChild(parentEl.children.item(this.startPadCount_ + i));
    }

    // Now set the data.
    for (const [index, value] of valueArray.entries()) {
      const childIndex = this.startPadCount_ + index;
      const element = parentEl.children.item(this.startPadCount_ + index);
      if (!this.childType_.check(element)) {
        throw AssertionError.type(`child[${childIndex}]`, this.childType_, element);
      }
      this.setter_(value, element);
    }
  }
}

export function childrenSelector<E extends Element, T>(
    elementSelector: ElementSelector<HTMLElement>,
    factory: Factory<E>,
    getter: Getter<E, T>,
    setter: Setter<E, T>,
    childDataType: Type<T>,
    childType: Type<E>,
    pad: {end?: number, start?: number} = {}): ChildrenSelector<T> {
  const endPad = pad.end || 0;
  const startPad = pad.start || 0;
  if (elementSelector instanceof ElementSelectorStub) {
    return new ChildrenSelectorStub(
        elementSelector,
        factory,
        getter,
        setter,
        childDataType,
        childType,
        startPad,
        endPad);
  } else if (elementSelector instanceof ElementSelectorImpl) {
    return new ChildrenSelectorImpl(
        elementSelector,
        factory,
        getter,
        setter,
        childDataType,
        childType,
        startPad,
        endPad);
  } else {
    throw new Error(`Unhandled ElementSelector type ${elementSelector}`);
  }
}
