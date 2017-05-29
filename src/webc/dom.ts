import { monad } from '../event/monad';
import { MonadFactory } from '../interfaces/monad-factory';
import { Parser } from '../interfaces/parser';
import { AttributeBinder } from '../webc/attribute-binder';
import { Util } from '../webc/util';

type AttributeConfig = {name: string, parser: Parser<any>, selector: string | null};

export class Dom {
  static attribute(config: AttributeConfig): ParameterDecorator {
    return Dom.createMonad_(
        (instance: Object) => {
          const {name: attributeName, parser, selector} = config;
          const targetElement = Dom.requireTargetElement_(selector, instance);
          return AttributeBinder.of(targetElement, attributeName, parser);
        },
        config);
  }

  private static createMonad_(factory: MonadFactory<any>, id: any): ParameterDecorator {
    return monad(factory, id);
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

export const dom = Dom;
