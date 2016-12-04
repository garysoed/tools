import {Annotations} from '../data/annotations';
import {AttributeBinder} from './attribute-binder';
import {IDomBinder} from './interfaces';


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

  private createBinder_(
      element: HTMLElement,
      attributeName: string): IDomBinder<any> {
    let targetEl = this.selector_ === null ?
        element :
        element.shadowRoot.querySelector(this.selector_);
    return AttributeBinder.of(targetEl, attributeName);
  }

  /**
   * Binds the annotated [AttributeBinder] to an annotation in the DOM.
   *
   * @param selector Selector for the element.
   * @param attributeName Name of the attribute to bind to.
   * @return Property descriptor.
   */
  attribute(attributeName: string): PropertyDecorator {
    let self: Bind = this;
    return function(target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forCtor(target.constructor).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            return self.createBinder_(element, attributeName);
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
