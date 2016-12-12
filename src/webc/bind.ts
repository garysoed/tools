import {Annotations} from '../data/annotations';
import {AttributeBinder} from './attribute-binder';
import {ChildrenElementsBinder} from './children-elements-binder';
import {IAttributeParser, IDomBinder} from './interfaces';
import {PropertyBinder} from './property-binder';
import {Util} from './util';


type BinderFactory = (element: HTMLElement) => IDomBinder<any>;

export const ANNOTATIONS: Annotations<BinderFactory> =
    Annotations.of<BinderFactory>(Symbol('bind'));

export class Bind {
  private selector_: string | null;

  /**
   * @param selector Selector query to find the element to bind to, or null if the root
   *    should be used.
   */
  constructor(selector: string | null) {
    this.selector_ = selector;
  }

  /**
   * Binds the annotated [IDomBinder] to an annotation in the DOM.
   *
   * @param attributeName Name of the attribute to bind to.
   * @param parser The attribute parser.
   * @return Property descriptor.
   */
  attribute<T>(attributeName: string, parser: IAttributeParser<T>): PropertyDecorator {
    let self = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            // TODO: Warn that targetEl is null.
            return AttributeBinder
                .of<T>(Util.resolveSelector(self.selector_, element)!, attributeName, parser);
          });
    };
  }

  /**
   * Binds the annotated [IDomBinder] to control the children of DOM elements.
   *
   * @param elementGenerator Function to generate new elements to use for the children.
   * @param dataSetter Function to add data to the generated element.
   * @return Property descriptor
   */
  childrenElements<T>(
      elementGenerator: (document: Document) => Element,
      dataSetter: (data: T, element: Element) => void): PropertyDecorator {
    let self = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            // TODO: Warn that targetEl is null.
            return ChildrenElementsBinder.of<T>(
                Util.resolveSelector(self.selector_, element)!,
                dataSetter,
                elementGenerator);
          });
    };
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
    let self = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            // TODO: Warn that targetEl is null.
            return PropertyBinder.of<any>(
                Util.resolveSelector(self.selector_, element)!, propertyName);
          });
    };
  }
}

/**
 * Annotation to bind classes to a location in the DOM.
 */
export function bind(selector: string | null): Bind {
  return new Bind(selector);
};
