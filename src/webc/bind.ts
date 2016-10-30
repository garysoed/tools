import {Annotations} from '../data/annotations';
import {AttributeBinder} from './attribute-binder';
import {IDomBinder} from './interfaces';


type BinderFactory = (element: HTMLElement) => IDomBinder<any>;

export const ANNOTATIONS: Annotations<BinderFactory> =
    Annotations.of<BinderFactory>(Symbol('bind'));

export class Bind {
  private useShadow_: boolean;

  /**
   * @param useShadow True iff evaluating the selector should look in the element's shadow root.
   */
  constructor(useShadow: boolean) {
    this.useShadow_ = useShadow;
  }

  private createBinder_(
      element: HTMLElement,
      selector: string | null,
      attributeName: string): IDomBinder<any> {
    let rootEl = this.useShadow_ ? element.shadowRoot : element;
    let targetEl = selector === null ? rootEl : rootEl.querySelector(selector);
    return AttributeBinder.of(targetEl, attributeName);
  }

  /**
   * Binds the annotated [AttributeBinder] to an annotation in the DOM.
   *
   * @param selector Selector for the element.
   * @param attributeName Name of the attribute to bind to.
   * @return Property descriptor.
   */
  attribute(selector: string | null, attributeName: string): PropertyDecorator {
    let self: Bind = this;
    return function(useShadow: boolean, target: Object, propertyKey: string | symbol): void {
      ANNOTATIONS.forPrototype(target.constructor.prototype).attachValueToProperty(
          propertyKey,
          (element: HTMLElement): IDomBinder<any> => {
            return self.createBinder_(element, selector, attributeName);
          });
    }.bind(this, this.useShadow_);
  }
}

/**
 * Annotation to bind classes to a location in the DOM.
 */
export const bind = {
  host: new Bind(false),
  shadow: new Bind(true),
};
