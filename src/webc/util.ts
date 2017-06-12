import { StringType } from '../check/string-type';
import { ImmutableMap } from '../immutable/immutable-map';
import { Parser } from '../interfaces/parser';
import { ElementSelector } from '../interfaces/selector';
import { Cases } from '../string/cases';
import { assertUnreachable } from '../typescript/assert-unreachable';
import { IElementConfig } from '../webc/interfaces';

const __CONFIG: symbol = Symbol('config');
const __ELEMENT: symbol = Symbol('element');

export class Util {
  /**
   * Adds the given attributes to the given element.
   *
   * @param element The element to add the attribute to.
   * @param attributes Mapping of attribute name to attribute parser. The attribute name will be
   *    converted to lower-case to be used for the attribute on the element. The element will get
   *    a getter / setter which will modify the attribute value directly.
   */
  static addAttributes(
      element: HTMLElement, attributes: {[name: string]: Parser<any>}): void  {
    for (const [name, parser] of ImmutableMap.of(attributes)) {
      const attrName = Cases.of(name).toLowerCase();
      Object.defineProperty(
          element,
          name,
          {
            get: () => {
              return parser.parse(element.getAttribute(attrName));
            },
            set: (value: any) => {
              element.setAttribute(attrName, parser.stringify(value));
            },
          });
    }
  }

  /**
   * Gets the configuration object corresponding to the given constructor.
   *
   * @param ctor The constructor to get the configuration from.
   * @return The configuration from the given constructor.
   */
  static getConfig(ctor: gs.ICtor<any>): IElementConfig {
    return ctor[__CONFIG];
  }

  /**
   * Gets the element corresponding to the given instance.
   *
   * @param instance The instance to get the element from.
   * @return The element corresponding to the given instance.
   */
  static getElement(instance: any): HTMLElement | null {
    return instance[__ELEMENT];
  }

  static requireSelector(
      selector: ElementSelector, parentElement: HTMLElement): HTMLElement {
    const element = Util.resolveSelector(selector, parentElement);
    if (!element) {
      throw new Error(`No elements found for ${selector}`);
    }
    return element;
  }

  /**
   * Gets the target element according to the given config.
   *
   * @param config The configuration to use to get the target element.
   * @param element The root of the element.
   * @return The target element.
   */
  static resolveSelector(
      selector: ElementSelector, parentElement: HTMLElement): HTMLElement | null {
    if (selector === null || parentElement.shadowRoot === null) {
      return parentElement;
    } else if (selector === 'parent') {
      return parentElement.parentElement;
    } else if (StringType.check(selector)) {
      return parentElement.shadowRoot.querySelector(selector) as HTMLElement;
    } else {
      throw assertUnreachable(selector);
    }
  }

  /**
   * Sets the configuration object to the given constructor.
   *
   * @param ctor The constructor to set the configuration to.
   * @param config The configuration object to set.
   */
  static setConfig(ctor: gs.ICtor<any>, config: IElementConfig): void {
    ctor[__CONFIG] = config;
  }

  /**
   * Sets the element to the given instance.
   *
   * @param instance The instance to set the element to.
   * @param element The element to set to the given instance.
   */
  static setElement(instance: any, element: HTMLElement): void {
    instance[__ELEMENT] = element;
  }
}
