import { Type } from '../check';
import { instanceId } from '../graph';
import { Parser } from '../interfaces';
import {
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';
import { Listener } from '../persona/listener';
import { SelectorImpl, SelectorStub } from '../persona/selector';
import { ElementSelector, InnerTextSelector } from '../persona/selectors';

export class InnerTextSelectorStub<T> extends SelectorStub<T> implements InnerTextSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorStub<HTMLElement>,
      private readonly parser_: Parser<T>,
      private readonly type_: Type<T>,
      private readonly defaultValue_: T) {
    super();
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.throwStub();
  }

  resolve(allSelectors: {}): InnerTextSelectorImpl<T> {
    return new InnerTextSelectorImpl(
        this.elementSelector_.resolve(allSelectors),
        this.parser_,
        this.type_,
        this.defaultValue_);
  }
}

export class InnerTextSelectorImpl<T> extends SelectorImpl<T> implements InnerTextSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorImpl<HTMLElement>,
      private readonly parser_: Parser<T>,
      type: Type<T>,
      defaultValue: T) {
    super(defaultValue, instanceId(`${elementSelector_.getSelector()}@innerText`, type));
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.elementSelector_;
  }

  getListener(): Listener<never> {
    // TODO: implement
    throw new Error('Unimplemented');
  }

  getValue(root: ShadowRoot): T | null {
    const element = this.elementSelector_.getValue(root);
    return this.parser_.parse(element.innerText);
  }

  setValue_(value: T, root: ShadowRoot): void {
    const element = this.elementSelector_.getValue(root);
    element.innerText = this.parser_.stringify(value);
  }
}

export function innerTextSelector<T>(
    elementSelector: ElementSelector<HTMLElement>,
    parser: Parser<T>,
    type: Type<T>,
    defaultValue: T): InnerTextSelector<T> {
  if (elementSelector instanceof ElementSelectorStub) {
    return new InnerTextSelectorStub(elementSelector, parser, type, defaultValue);
  } else if (elementSelector instanceof ElementSelectorImpl) {
    return new InnerTextSelectorImpl(elementSelector, parser, type, defaultValue);
  } else {
    throw new Error(`Unhandled ElementSelector type ${elementSelector}`);
  }
}
