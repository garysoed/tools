import { monad } from '../event/monad';
import { monadOut } from '../event/monad-out';
import { AttributeConfig } from '../interfaces/attribute-config';
import { ElementConfig } from '../interfaces/element-config';
import { MonadFactory } from '../interfaces/monad-factory';
import { Parser } from '../interfaces/parser';
import { AttributeBinder } from '../webc/attribute-binder';
import { ElementBinder } from '../webc/element-binder';
import { Util } from '../webc/util';


export class Dom {
  constructor(private readonly setter_: boolean) { }

  attribute(config: AttributeConfig<any>): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const {name: attributeName, parser, selector} = config;
          const targetElement = Dom.requireTargetElement_(selector, instance);
          return AttributeBinder.of(targetElement, attributeName, parser);
        });
  }

  private createMonad_(factory: MonadFactory<any>): ParameterDecorator {
    return this.setter_ ? monadOut(factory) : monad(factory);
  }

  element(config: ElementConfig): ParameterDecorator {
    return this.createMonad_(
        (instance: Object) => {
          const {selector} = config;
          const targetElement = Dom.requireTargetElement_(selector, instance);
          return ElementBinder.of(targetElement);
        });
  }

  private static requireTargetElement_(selector: string | null, instance: Object): Element {
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
