import { monad } from '../event/monad';
import { monadOut } from '../event/monad-out';
import { MonadFactory } from '../interfaces/monad-factory';
import {
    AttributeSelector,
    ChildElementsSelector,
    ElementSelector,
    InnerTextSelector } from '../interfaces/selector';
import { AttributeBinder } from '../webc/attribute-binder';
import { ElementBinder } from '../webc/element-binder';
import { EventDispatcher } from '../webc/event-dispatcher';
import { ChildrenElementsBinder } from '../webc/immutable-children-elements-binder';
import { InnerTextBinder } from '../webc/inner-text-binder';
import { Util } from '../webc/util';


export class Dom {
  constructor(private readonly setter_: boolean) { }

  attribute(config: AttributeSelector<any>): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const {name: attributeName, parser, selector} = config;
          const targetElement = Dom.requireTargetElement_(selector, instance);
          return AttributeBinder.of(targetElement, attributeName, parser);
        });
  }

  childElements<T>(config: ChildElementsSelector<T>): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const {bridge, endPadCount, selector, startPadCount} = config;
          const element = Dom.requireTargetElement_(selector, instance);
          return ChildrenElementsBinder.of<T>(
              element,
              bridge,
              startPadCount || 0,
              endPadCount || 0,
              instance);
        });
  }

  private createMonad_(factory: MonadFactory<any>): ParameterDecorator {
    return this.setter_ ? monadOut(factory) : monad(factory);
  }

  /**
   * Resolves to an element. This is READONLY.
   * @param selector Selector for the element.
   */
  element(selector: ElementSelector): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const targetElement = Dom.requireTargetElement_(selector, instance);
          return ElementBinder.of(targetElement);
        });
  }

  eventDispatcher(): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const targetElement = Dom.requireTargetElement_(null, instance);
          return EventDispatcher.of(targetElement);
        });
  }

  innerText(config: InnerTextSelector<any>): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const targetElement = Dom.requireTargetElement_(config.selector, instance);
          return InnerTextBinder.of(targetElement, config.parser);
        });
  }

  private static requireTargetElement_(selector: ElementSelector, instance: Object): HTMLElement {
    const root = Util.getElement(instance);
    if (!root) {
      throw new Error(`Element not found for ${instance}`);
    }

    const targetElement = Util.resolveSelector(selector, root);
    if (!targetElement) {
      throw new Error(`Target element not found for ${selector}@${instance}`);
    }
    return targetElement;
  }
}

export const dom = new Dom(false);
export const domOut = new Dom(true);
