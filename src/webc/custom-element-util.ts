import { Maps } from '../collection/maps';
import { Parser } from '../interfaces/parser';
import { Cases } from '../string/cases';
import { IElementConfig } from '../webc/interfaces';


const __CONFIG: symbol = Symbol('config');
const __ELEMENT: symbol = Symbol('element');

export class CustomElementUtil {
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
    Maps.fromRecord(attributes)
        .forEach((parser: Parser<any>, name: string) => {
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
        });
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
