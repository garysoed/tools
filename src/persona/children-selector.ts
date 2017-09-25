import { FiniteIterableOfType, Type } from '../check';
import { AssertionError } from '../error';
import { instanceId } from '../graph';
import { ImmutableList, ImmutableSet } from '../immutable';
import { ElementSelector } from '../persona/element-selector';
import { Selector, SelectorImpl, SelectorStub } from '../persona/selector';
import { SlotSelector, SlotSelectorImpl, SlotSelectorStub } from '../persona/slot-selector';

type Factory<E extends Element> = (document: Document) => E;
type Getter<E extends Element, T> = (element: E) => T;
type Setter<E extends Element, T> = (data: T, element: E) => void;

export interface ChildrenSelector<T> extends Selector<ImmutableList<T>> { }

export class ChildrenSelectorStub<E extends Element, T> extends
    SelectorStub<ImmutableList<T>> implements ChildrenSelector<T> {
  constructor(
      private readonly slotSelector_: SlotSelectorStub,
      private readonly factory_: Factory<E>,
      private readonly getter_: Getter<E, T>,
      private readonly setter_: Setter<E, T>,
      private readonly childDataType_: Type<T>,
      private readonly childType_: Type<E>) {
    super();
  }

  resolve(allSelectors: {}): ChildrenSelectorImpl<E, T> {
    return new ChildrenSelectorImpl(
        this.slotSelector_.resolve(allSelectors),
        this.factory_,
        this.getter_,
        this.setter_,
        this.childDataType_,
        this.childType_);
  }
}

export class ChildrenSelectorImpl<E extends Element, T> extends
    SelectorImpl<ImmutableList<T>> implements ChildrenSelector<T> {
  private readonly elementPool_: Set<E> = new Set();

  constructor(
      private readonly slotSelector_: SlotSelectorImpl,
      private readonly factory_: Factory<E>,
      private readonly getter_: Getter<E, T>,
      private readonly setter_: Setter<E, T>,
      private readonly childDataType_: Type<T>,
      private readonly childType_: Type<E>) {
    super(
        instanceId(`${slotSelector_.getParentSelector().getSelector()}@children`,
        FiniteIterableOfType(childDataType_)));
  }

  private getChildElements_(root: ShadowRoot): ImmutableList<E> {
    const slot = this.slotSelector_.getValue(root);
    let currentNode = slot.start.nextSibling;

    const elements: E[] = [];
    while (currentNode !== slot.end) {
      if (!this.childType_.check(currentNode)) {
        throw AssertionError.type('child', this.childType_, currentNode);
      }
      elements.push(currentNode);
      currentNode = currentNode.nextSibling;
    }

    return ImmutableList.of(elements);
  }

  private getElement_(parentEl: Node): E {
    const element = [...ImmutableSet.of(this.elementPool_)][0];
    if (!element) {
      return this.factory_(parentEl.ownerDocument);
    } else {
      this.elementPool_.delete(element);
      return element;
    }
  }

  getParentSelector(): ElementSelector<HTMLElement> {
    return this.slotSelector_.getParentSelector();
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
    const existingChildren = this.getChildElements_(root);
    const {end: endNode, start: startNode} = this.slotSelector_.getValue(root);
    const parent = startNode.parentNode;
    if (!parent) {
      throw AssertionError.condition('parent node', 'to exist', parent);
    }

    // Insert enough elements if there are not enough.
    for (let i = 0; i < valueArray.size() - existingChildren.size(); i++) {
      parent.insertBefore(this.getElement_(parent), endNode);
    }

    // Delete elements until there are enough number of elements.
    for (
        let i = existingChildren.size() - valueArray.size() - 1;
        i >= 0 && startNode.nextSibling;
        i--) {
      parent.removeChild(startNode.nextSibling);
    }

    // Now set the data.
    const childElements = this.getChildElements_(root);
    for (const [index, value] of valueArray.entries()) {
      const element = childElements.getAt(index);
      if (!element) {
        throw AssertionError.condition(`child[${index}]`, 'to exist', element);
      }
      this.setter_(value, element);
    }
  }
}

export function childrenSelector<E extends Element, T>(
    elementSelector: SlotSelector,
    factory: Factory<E>,
    getter: Getter<E, T>,
    setter: Setter<E, T>,
    childDataType: Type<T>,
    childType: Type<E>): ChildrenSelector<T> {
  if (elementSelector instanceof SlotSelectorStub) {
    return new ChildrenSelectorStub(
        elementSelector,
        factory,
        getter,
        setter,
        childDataType,
        childType);
  } else if (elementSelector instanceof SlotSelectorImpl) {
    return new ChildrenSelectorImpl(
        elementSelector,
        factory,
        getter,
        setter,
        childDataType,
        childType);
  } else {
    throw new Error(`Unhandled ElementSelector type ${elementSelector}`);
  }
}
