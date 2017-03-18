import { Annotations } from '../data/annotations';
import { AttributeBinder } from '../webc/attribute-binder';
import { ChildrenElementsBinder } from '../webc/children-elements-binder';
import { ClassListBinder } from '../webc/class-list-binder';
import { ElementSwitchBinder } from '../webc/element-switch-binder';
import { IAttributeParser, IDomBinder } from '../webc/interfaces';
import { PropertyBinder } from '../webc/property-binder';
import { Util } from '../webc/util';


type BinderFactory = (element: HTMLElement, instance: any) => IDomBinder<any>;

export const ANNOTATIONS: Annotations<BinderFactory> =
    Annotations.of<BinderFactory>(Symbol('bind'));

export class Bind {
  private readonly selector_: string | null;

  /**
   * @param selector Selector query to find the element to bind to, or null if the root
   *    should be used.
   */
  constructor(selector: string | null) {
    this.selector_ = selector;
  }

  /**
   * Creates the decorator.
   *
   * @param binderFactory Factory that generates the binder.
   * @return The property decorator.
   */
  private createDecorator_(
      binderFactory: (element: Element, instance: any) => IDomBinder<any>): PropertyDecorator {
    const self = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (parentEl: HTMLElement, instance: any): IDomBinder<any> => {
            const element = Util.resolveSelector(self.selector_, parentEl);
            if (element === null) {
              throw new Error(`Cannot resolve selector ${self.selector_}`);
            }
            return binderFactory(element, instance);
          });
    };
  }

  /**
   * Binds the annotated [IDomBinder] to an annotation in the DOM.
   *
   * @param attributeName Name of the attribute to bind to.
   * @param parser The attribute parser.
   * @return Property descriptor.
   */
  attribute<T>(attributeName: string, parser: IAttributeParser<T>): PropertyDecorator {
    return this.createDecorator_(
        (element: Element): IDomBinder<any> => {
          return AttributeBinder.of<T>(element, attributeName, parser);
        });
  }

  /**
   * Binds the annotated [IDomBinder] to control the children of DOM elements.
   * $annotates DOM Binders of type DomBinder<T[]>
   * @param elementGenerator Function to generate new elements to use for the children.
   * @param dataSetter Function to add data to the generated element.
   * @return Property descriptor
   */
  childrenElements<T>(
      elementGenerator: (document: Document, instance: any) => Element,
      dataGetter: (element: Element) => T | null,
      dataSetter: (data: T, element: Element, instance: any) => void,
      insertionIndex: number = 0): PropertyDecorator {
    return this.createDecorator_(
        (element: Element, instance: any): IDomBinder<any> => {
          return ChildrenElementsBinder.of<T>(
              element,
              dataGetter,
              dataSetter,
              elementGenerator,
              insertionIndex,
              instance);
        });
  }

  /**
   * Binds the annotated [IDomBinder] to control the class list of the DOM element.
   *
   * @return Property descriptor
   */
  classList(): PropertyDecorator {
    return this.createDecorator_(
        (element: Element): IDomBinder<any> => {
          return ClassListBinder.of(element);
        });
  }

  /**
   * Binds the annotated [IDomBinder] to control the visibility of children elements.
   *
   * @param mapping Mapping from enum value to ID of the element to associate it with.
   * @return Property decorator.
   */
  elementSwitch<T>(mapping: Map<T, string>): PropertyDecorator {
    return this.createDecorator_(
        (element: Element): IDomBinder<any> => {
          return ElementSwitchBinder.of(element, mapping);
        });
  }

  /**
   * @return Property descriptor
   */
  innerText(): PropertyDecorator {
    return this.property('innerText');
  }

  /**
   * Binds the annotated [IDomBinder] to a property of an element in the DOM.
   *
   * @param propertyName Name of the property to bind to.
   * @return Property descriptor
   */
  property(propertyName: string): PropertyDecorator {
    return this.createDecorator_(
        (element: HTMLElement): IDomBinder<any> => {
          return PropertyBinder.of<any>(element, propertyName);
        });
  }
}

/**
 * Annotation to bind classes to a location in the DOM.
 */
export function bind(selector: string | null): Bind {
  return new Bind(selector);
};
