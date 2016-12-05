import {Annotations} from '../data/annotations';
import {AttributeBinder} from './attribute-binder';
import {IAttributeParser, IDomBinder} from './interfaces';
import {PropertyBinder} from './property-binder';


type BinderFactory = (element: HTMLElement) => IDomBinder<any>;

export const ANNOTATIONS: Annotations<BinderFactory> =
    Annotations.of<BinderFactory>(Symbol('bind'));

export class Bind {
  private selector_: string | null;

  /**
   * @param useShadow True iff evaluating the selector should look in the element's shadow root.
   */
  constructor(selector: string | null) {
    this.selector_ = selector;
  }

  private getTargetEl_(element: HTMLElement): Element {
    return this.selector_ === null ?
        element :
        element.shadowRoot.querySelector(this.selector_);
  }

  /**
   * Binds the annotated [IDomBinder] to an annotation in the DOM.
   *
   * @param attributeName Name of the attribute to bind to.
   * @param parser The attribute parser.
   * @return Property descriptor.
   */
  attribute<T>(attributeName: string, parser: IAttributeParser<T>): PropertyDecorator {
    let self: Bind = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            return AttributeBinder.of<T>(self.getTargetEl_(element), attributeName, parser);
          });
    };
  }

  /**
   * Binds the annotated [IDomBinder] to an annotation in the DOM.
   *
   * @param propertyName Name of the property to bind to.
   * @return Property descriptor.
   */
  property(propertyName: string): PropertyDecorator {
    let self: Bind = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            return PropertyBinder.of<any>(self.getTargetEl_(element), propertyName);
          });
    };
  }
}

/**
 * Annotation to bind classes to a location in the DOM.
 */
export function bind(selector: string): Bind {
  return new Bind(selector);
};
