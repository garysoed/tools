import { IType } from '../check';
import { instanceId } from '../graph';
import { Parser } from '../interfaces';
import {
  ElementSelector,
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';
import { Selector, SelectorImpl, SelectorStub } from '../persona/selector';

export interface InnerTextSelector<T> extends Selector<T> {
  getElementSelector(): ElementSelector<HTMLElement>;
}

export class InnerTextSelectorStub<T> extends SelectorStub<T> implements InnerTextSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorStub<HTMLElement>,
      private readonly parser_: Parser<T>,
      private readonly type_: IType<T>) {
    super();
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.throwStub();
  }

  resolve(allSelectors: {}): InnerTextSelectorImpl<T> {
    return new InnerTextSelectorImpl(
        this.elementSelector_.resolve(allSelectors),
        this.parser_,
        this.type_);
  }
}

export class InnerTextSelectorImpl<T> extends SelectorImpl<T> implements InnerTextSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorImpl<HTMLElement>,
      private readonly parser_: Parser<T>,
      type: IType<T>) {
    super(instanceId(`${elementSelector_.getSelector()}@innerText`, type));
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.elementSelector_;
  }

  getValue(root: ShadowRoot): T | null {
    const element = this.elementSelector_.getValue(root);
    return this.parser_.parse(element.innerText);
  }

  setValue(value: T, root: ShadowRoot): void {
    const element = this.elementSelector_.getValue(root);
    element.innerText = this.parser_.stringify(value);
  }
}

export function innerTextSelector<T>(
    elementSelector: ElementSelector<HTMLElement>,
    parser: Parser<T>,
    type: IType<T>): InnerTextSelector<T> {
  if (elementSelector instanceof ElementSelectorStub) {
    return new InnerTextSelectorStub(elementSelector, parser, type);
  } else if (elementSelector instanceof ElementSelectorImpl) {
    return new InnerTextSelectorImpl(elementSelector, parser, type);
  } else {
    throw new Error(`Unhandled ElementSelector type ${elementSelector}`);
  }
}
