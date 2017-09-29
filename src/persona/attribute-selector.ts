import { Type } from '../check';
import { instanceId } from '../graph';
import { Parser } from '../interfaces';
import {
  ElementSelector,
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';
import { Selector, SelectorImpl, SelectorStub } from '../persona/selector';

export interface AttributeSelector<T> extends Selector<T> {
  getElementSelector(): ElementSelector<any>;

  getName(): string;
}

export class AttributeSelectorStub<T> extends SelectorStub<T> implements AttributeSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorStub<HTMLElement>,
      private readonly parser_: Parser<T>,
      private readonly attrName_: string,
      private readonly type_: Type<T>,
      private readonly defaultValue_: T | undefined) {
    super();
  }

  getElementSelector(): ElementSelector<any> {
    return this.elementSelector_;
  }

  getName(): string {
    return this.attrName_;
  }

  resolve(allSelectors: {}): SelectorImpl<T> {
    return new AttributeSelectorImpl<T>(
        this.elementSelector_.resolve(allSelectors),
        this.parser_,
        this.attrName_,
        this.type_,
        this.defaultValue_);
    }
}

export class AttributeSelectorImpl<T> extends SelectorImpl<T> implements AttributeSelector<T> {
  constructor(
      private readonly elementSelector_: ElementSelectorImpl<HTMLElement>,
      private readonly parser_: Parser<T>,
      private readonly attrName_: string,
      type: Type<T>,
      defaultValue: T | undefined) {
    super(defaultValue, instanceId(`${elementSelector_.getSelector()}[${attrName_}]`, type));
  }

  getElementSelector(): ElementSelector<HTMLElement> {
    return this.elementSelector_;
  }

  getName(): string {
    return this.attrName_;
  }

  getValue(root: ShadowRoot): T | null {
    const element = this.elementSelector_.getValue(root);
    const defaultValue = this.getDefaultValue();
    if (!element.hasAttribute(this.attrName_) && defaultValue !== undefined) {
      return defaultValue;
    }
    const strValue = element.getAttribute(this.attrName_);
    return this.parser_.parse(strValue);
  }

  setValue_(value: T | null, root: ShadowRoot): void {
    const strValue = this.parser_.stringify(value);
    const element = this.elementSelector_.getValue(root);
    if (strValue) {
      element.setAttribute(this.attrName_, strValue);
    } else {
      element.removeAttribute(this.attrName_);
    }
  }
}

export function attributeSelector<T>(
    elementSelector: ElementSelector<HTMLElement>,
    attrName: string,
    parser: Parser<T>,
    type: Type<T>,
    defaultValue: T): AttributeSelector<T> {
  if (elementSelector instanceof ElementSelectorStub) {
    return new AttributeSelectorStub(elementSelector, parser, attrName, type, defaultValue);
  } else if (elementSelector instanceof ElementSelectorImpl) {
    return new AttributeSelectorImpl(elementSelector, parser, attrName, type, defaultValue);
  } else {
    throw new Error(`Unhandled ElementSelector type ${elementSelector}`);
  }
}
